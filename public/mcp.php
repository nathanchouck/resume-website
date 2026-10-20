<?php
/**
 * nathanhouck.com MCP endpoint — read-only access to the Notebook, Musings, and Now.
 *
 * Served at https://nathanhouck.com/mcp (rewritten here by .htaccess).
 * Streamable HTTP, stateless, single JSON response per POST. Dual-era:
 *   - modern (2026-07-28): per-request _meta + MCP-* headers, validated strictly
 *   - legacy (2025-11-25 and earlier): initialize handshake, no session ids issued
 * Data comes from public/mcp-data/*.json, generated at build time by
 * scripts/build-notebook.mjs and scripts/build-ai-index.mjs.
 */

declare(strict_types=1);

const MODERN_VERSIONS = ['2026-07-28'];
const LEGACY_VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26'];
const SERVER_INFO = ['name' => 'nathanhouck-com', 'title' => "Nathan Houck's site", 'version' => '1.0.0'];
const DATA_DIR = __DIR__ . '/mcp-data';

const ERR_PARSE = -32700;
const ERR_INVALID_REQUEST = -32600;
const ERR_METHOD_NOT_FOUND = -32601;
const ERR_INVALID_PARAMS = -32602;
const ERR_HEADER_MISMATCH = -32020;
const ERR_UNSUPPORTED_VERSION = -32022;

// ---------------------------------------------------------------------------
// HTTP plumbing
// ---------------------------------------------------------------------------

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept, MCP-Protocol-Version, Mcp-Method, Mcp-Name, Mcp-Session-Id, Last-Event-ID');
header('Cache-Control: no-store');

function send(int $status, $body = null): void {
  http_response_code($status);
  if ($body !== null) {
    header('Content-Type: application/json');
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
  }
  exit;
}

function rpc_error($id, int $code, string $message, int $status = 200, $data = null): void {
  $error = ['code' => $code, 'message' => $message];
  if ($data !== null) $error['data'] = $data;
  send($status, ['jsonrpc' => '2.0', 'id' => $id, 'error' => $error]);
}

function rpc_result($id, array $result): void {
  send(200, ['jsonrpc' => '2.0', 'id' => $id, 'result' => $result]);
}

function header_value(string $name): ?string {
  $key = 'HTTP_' . strtoupper(str_replace('-', '_', $name));
  return isset($_SERVER[$key]) ? trim((string) $_SERVER[$key]) : null;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') send(204);
if ($method !== 'POST') {
  // No server-initiated SSE stream and no sessions to delete.
  header('Allow: POST, OPTIONS');
  send(405, [
    'jsonrpc' => '2.0',
    'id' => null,
    'error' => [
      'code' => ERR_INVALID_REQUEST,
      'message' => 'This is an MCP endpoint (Streamable HTTP). Send JSON-RPC requests with POST. Human-readable site index: https://nathanhouck.com/llms.txt',
    ],
  ]);
}

$msg = json_decode((string) file_get_contents('php://input'), true);
if (!is_array($msg)) rpc_error(null, ERR_PARSE, 'Parse error: body is not valid JSON.', 400);
if ($msg === []) rpc_error(null, ERR_INVALID_REQUEST, 'Empty JSON-RPC message.', 400);
if (array_is_list($msg)) rpc_error(null, ERR_INVALID_REQUEST, 'Batch requests are not supported.', 400);

$id = $msg['id'] ?? null;
$rpcMethod = $msg['method'] ?? null;
$params = is_array($msg['params'] ?? null) ? $msg['params'] : [];

if (($msg['jsonrpc'] ?? null) !== '2.0' || !is_string($rpcMethod)) {
  if (!isset($msg['method']) && (isset($msg['result']) || isset($msg['error']))) send(202); // a client response; we never ask for one
  rpc_error($id, ERR_INVALID_REQUEST, 'Invalid JSON-RPC request.', 400);
}

// Notifications (e.g. notifications/initialized) are accepted and need no answer.
if (!array_key_exists('id', $msg)) send(202);

// ---------------------------------------------------------------------------
// Era selection and modern header validation
// ---------------------------------------------------------------------------

$meta = is_array($params['_meta'] ?? null) ? $params['_meta'] : [];
$bodyVersion = $meta['io.modelcontextprotocol/protocolVersion'] ?? null;
$headerVersion = header_value('MCP-Protocol-Version');
$modern = $bodyVersion !== null || $rpcMethod === 'server/discover';

if ($modern) {
  if ($bodyVersion !== null) {
    if ($headerVersion === null || $headerVersion !== $bodyVersion) {
      rpc_error($id, ERR_HEADER_MISMATCH, "Header mismatch: MCP-Protocol-Version header must equal _meta protocolVersion '$bodyVersion'.", 400);
    }
    if (!in_array($bodyVersion, MODERN_VERSIONS, true)) {
      rpc_error($id, ERR_UNSUPPORTED_VERSION, 'Unsupported protocol version', 400, ['supported' => MODERN_VERSIONS, 'requested' => $bodyVersion]);
    }
  }
  $headerMethod = header_value('Mcp-Method');
  if ($bodyVersion !== null && $headerMethod !== $rpcMethod) {
    rpc_error($id, ERR_HEADER_MISMATCH, "Header mismatch: Mcp-Method header must equal body method '$rpcMethod'.", 400);
  }
  if ($rpcMethod === 'tools/call') {
    // Tool names here are plain ASCII, so the Base64 sentinel encoding never applies.
    $headerName = header_value('Mcp-Name');
    if ($headerName === null || $headerName !== ($params['name'] ?? null)) {
      rpc_error($id, ERR_HEADER_MISMATCH, 'Header mismatch: Mcp-Name header must equal params.name.', 400);
    }
  }
} elseif ($headerVersion !== null && !in_array($headerVersion, LEGACY_VERSIONS, true)) {
  if (in_array($headerVersion, MODERN_VERSIONS, true)) {
    rpc_error($id, ERR_HEADER_MISMATCH, "Header mismatch: MCP-Protocol-Version is '$headerVersion' but the request carries no _meta protocolVersion.", 400);
  }
  rpc_error($id, ERR_UNSUPPORTED_VERSION, 'Unsupported protocol version', 400, ['supported' => LEGACY_VERSIONS, 'requested' => $headerVersion]);
}

// Modern results carry resultType; legacy results stay in their original shape.
function finish($id, array $result, bool $modern): void {
  if ($modern) $result = ['resultType' => 'complete'] + $result;
  rpc_result($id, $result);
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

function data(string $name): array {
  static $cache = [];
  if (!isset($cache[$name])) {
    $path = DATA_DIR . "/$name.json";
    $cache[$name] = is_file($path) ? (json_decode((string) file_get_contents($path), true) ?: []) : [];
  }
  return $cache[$name];
}

function instructions(): string {
  $site = data('site');
  return ($site['summary'] ?? 'Nathan Houck\'s personal site.') . ' ' . ($site['provenance'] ?? '') .
    ' Use `search` to find anything across the notebook, essays, and Now page; `get_now` for his current status; ' .
    '`get_note` / `get_musing` for full text. Content is as of the last site deploy' .
    (isset($site['generated']) ? ' (' . substr($site['generated'], 0, 10) . ').' : '.');
}

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

function obj(array $a = []): object { return (object) $a; }

function tool_definitions(): array {
  $readOnly = ['readOnlyHint' => true, 'destructiveHint' => false, 'idempotentHint' => true, 'openWorldHint' => false];
  return [
    [
      'name' => 'search',
      'title' => 'Search the site',
      'description' => "Full-text search across Nathan Houck's Notebook (AI-synthesized notes on his aerospace coursework and topics), Musings (essays, stories, poems he wrote without AI), and Now page. Returns ranked matches with ids for get_note / get_musing.",
      'inputSchema' => [
        'type' => 'object',
        'properties' => obj([
          'query' => ['type' => 'string', 'description' => 'Words or a phrase to search for.'],
          'section' => ['type' => 'string', 'enum' => ['all', 'notes', 'musings', 'now'], 'description' => 'Limit to one section. Default: all.'],
          'limit' => ['type' => 'integer', 'minimum' => 1, 'maximum' => 20, 'description' => 'Maximum results. Default: 8.'],
        ]),
        'required' => ['query'],
      ],
      'annotations' => $readOnly,
    ],
    [
      'name' => 'get_now',
      'title' => 'What Nathan is doing now',
      'description' => "Nathan Houck's current-status log: what he's working on, testing, and looking for right now.",
      'inputSchema' => ['type' => 'object', 'properties' => obj()],
      'annotations' => $readOnly,
    ],
    [
      'name' => 'list_notes',
      'title' => 'List notebook notes',
      'description' => 'List every Notebook note (id, title, type), optionally filtered by type. Notes are AI-synthesized from Nathan\'s own coursework and sources.',
      'inputSchema' => [
        'type' => 'object',
        'properties' => obj([
          'type' => ['type' => 'string', 'enum' => ['topic', 'course', 'source', 'organization'], 'description' => 'Only notes of this type.'],
        ]),
      ],
      'annotations' => $readOnly,
    ],
    [
      'name' => 'get_note',
      'title' => 'Read a notebook note',
      'description' => 'Full markdown of one Notebook note (LaTeX math preserved), with its links and backlinks.',
      'inputSchema' => [
        'type' => 'object',
        'properties' => obj(['id' => ['type' => 'string', 'description' => 'Note id, e.g. "supersonic-nozzle-flow-and-schlieren".']]),
        'required' => ['id'],
      ],
      'annotations' => $readOnly,
    ],
    [
      'name' => 'list_musings',
      'title' => 'List musings',
      'description' => "List Nathan's published essays, short stories, and poems (written without AI), newest first.",
      'inputSchema' => ['type' => 'object', 'properties' => obj()],
      'annotations' => $readOnly,
    ],
    [
      'name' => 'get_musing',
      'title' => 'Read a musing',
      'description' => 'Full text of one essay, story, or poem, including its references.',
      'inputSchema' => [
        'type' => 'object',
        'properties' => obj(['slug' => ['type' => 'string', 'description' => 'Musing slug, e.g. "on-ai".']]),
        'required' => ['slug'],
      ],
      'annotations' => $readOnly,
    ],
  ];
}

function text_result(string $text, bool $isError = false): array {
  return ['content' => [['type' => 'text', 'text' => $text]], 'isError' => $isError];
}

function lower(string $s): string { return mb_strtolower($s, 'UTF-8'); }

function snippet(string $text, array $terms, int $width = 260): string {
  $flat = preg_replace('/\s+/u', ' ', $text);
  $hay = lower($flat);
  $pos = false;
  foreach ($terms as $t) { $pos = mb_strpos($hay, $t, 0, 'UTF-8'); if ($pos !== false) break; }
  $start = $pos === false ? 0 : max(0, $pos - 80);
  $out = mb_substr($flat, $start, $width, 'UTF-8');
  return ($start > 0 ? '…' : '') . trim($out) . (mb_strlen($flat, 'UTF-8') > $start + $width ? '…' : '');
}

function now_text(array $now): string {
  $parts = [];
  foreach ($now['sections'] ?? [] as $s) {
    $parts[] = "## {$s['label']}: {$s['heading']}\n\n" . implode("\n\n", $s['paragraphs']);
  }
  return implode("\n\n", $parts);
}

function tool_search(array $args): array {
  $query = trim((string) ($args['query'] ?? ''));
  if ($query === '') return text_result('`query` is required.', true);
  $section = $args['section'] ?? 'all';
  $limit = max(1, min(20, (int) ($args['limit'] ?? 8)));
  $phrase = lower($query);
  $terms = array_values(array_filter(preg_split('/[^\p{L}\p{N}]+/u', $phrase), fn($t) => mb_strlen($t, 'UTF-8') >= 2));
  if (!$terms) $terms = [$phrase];

  $docs = [];
  if ($section === 'all' || $section === 'notes') {
    foreach (data('notes')['notes'] ?? [] as $n) {
      $docs[] = ['section' => 'notes', 'id' => $n['id'], 'title' => $n['title'], 'kind' => $n['type'], 'url' => $n['url'], 'body' => $n['md']];
    }
  }
  if ($section === 'all' || $section === 'musings') {
    foreach (data('musings')['musings'] ?? [] as $m) {
      $docs[] = ['section' => 'musings', 'id' => $m['slug'], 'title' => $m['title'], 'kind' => $m['category'] ?? 'musing', 'url' => $m['url'], 'body' => $m['description'] . "\n" . $m['text']];
    }
  }
  if ($section === 'all' || $section === 'now') {
    $now = data('now');
    if ($now) $docs[] = ['section' => 'now', 'id' => 'now', 'title' => 'Now (updated ' . ($now['updated'] ?? '?') . ')', 'kind' => 'status', 'url' => $now['url'] ?? '', 'body' => now_text($now)];
  }

  $scored = [];
  foreach ($docs as $d) {
    $title = lower($d['title']);
    $body = lower($d['body']);
    $score = 0;
    foreach ($terms as $t) {
      $score += 5 * substr_count($title, $t) + min(substr_count($body, $t), 15);
    }
    if (count($terms) > 1) {
      if (str_contains($title, $phrase)) $score += 15;
      if (str_contains($body, $phrase)) $score += 5;
    }
    if ($score > 0) $scored[] = $d + ['score' => $score];
  }
  usort($scored, fn($a, $b) => $b['score'] <=> $a['score']);
  $hits = array_slice($scored, 0, $limit);
  if (!$hits) return text_result("No matches for \"$query\". Try broader words, or list_notes / list_musings to browse.");

  $lines = [count($scored) . " match(es) for \"$query\"; showing " . count($hits) . ':', ''];
  foreach ($hits as $i => $h) {
    $fetch = $h['section'] === 'notes' ? "get_note id=\"{$h['id']}\"" : ($h['section'] === 'musings' ? "get_musing slug=\"{$h['id']}\"" : 'get_now');
    $lines[] = ($i + 1) . ". [{$h['section']}] {$h['title']} ({$h['kind']})";
    $lines[] = "   {$h['url']} · read with: $fetch";
    $lines[] = '   ' . snippet($h['body'], $terms);
    $lines[] = '';
  }
  return text_result(rtrim(implode("\n", $lines)));
}

function find_note(string $id): ?array {
  foreach (data('notes')['notes'] ?? [] as $n) if ($n['id'] === $id) return $n;
  return null;
}

function note_titles(array $ids): string {
  $out = [];
  foreach ($ids as $i) { $n = find_note($i); $out[] = $n ? "{$n['title']} ($i)" : $i; }
  return $out ? implode('; ', $out) : 'none';
}

function tool_get_note(array $args): array {
  $id = trim((string) ($args['id'] ?? ''));
  $n = $id !== '' ? find_note($id) : null;
  if (!$n) return text_result("No note with id \"$id\". Use search or list_notes to find ids.", true);
  $meta = [$n['type']];
  if (!empty($n['tags'])) $meta[] = 'tags: ' . implode(', ', $n['tags']);
  if (!empty($n['lastReviewed'])) $meta[] = 'reviewed ' . $n['lastReviewed'];
  $text = "# {$n['title']}\n\n" . implode(' · ', $meta) . "\n{$n['url']}\n" .
    "_AI-synthesized from Nathan Houck's own notes and coursework._\n\n{$n['md']}\n\n" .
    "Links to: " . note_titles($n['links']) . "\nReferenced by: " . note_titles($n['backlinks']);
  return text_result($text);
}

function tool_list_notes(array $args): array {
  $type = $args['type'] ?? null;
  $notes = array_filter(data('notes')['notes'] ?? [], fn($n) => $type === null || $n['type'] === $type);
  if (!$notes) return text_result('No notes' . ($type ? " of type \"$type\"" : '') . '.');
  $lines = [count($notes) . ' note(s)' . ($type ? " of type $type" : '') . ' — id · title · type:'];
  foreach ($notes as $n) $lines[] = "{$n['id']} · {$n['title']} · {$n['type']}";
  return text_result(implode("\n", $lines));
}

function tool_list_musings(): array {
  $lines = [];
  foreach (data('musings')['musings'] ?? [] as $m) {
    $lines[] = "{$m['slug']} · {$m['title']} · " . ($m['category'] ?? 'musing') . ' · ' . ($m['date'] ?? '') . "\n   {$m['description']}";
  }
  return text_result($lines ? implode("\n", $lines) : 'No musings published.');
}

function tool_get_musing(array $args): array {
  $slug = lower(trim((string) ($args['slug'] ?? '')));
  foreach (data('musings')['musings'] ?? [] as $m) {
    if ($m['slug'] === $slug) {
      $head = "# {$m['title']}\n\n" . implode(' · ', array_filter([$m['category'] ?? null, $m['date'] ?? null, $m['url']])) .
        "\n_Written by Nathan Houck without AI tools._\n\n";
      return text_result($head . $m['text']);
    }
  }
  return text_result("No musing with slug \"$slug\". Use list_musings to see slugs.", true);
}

function tool_get_now(): array {
  $now = data('now');
  if (!$now) return text_result('The Now page data is unavailable.', true);
  return text_result("# Now (updated {$now['updated']})\n{$now['url']}\n\n" . now_text($now));
}

// ---------------------------------------------------------------------------
// Dispatch
// ---------------------------------------------------------------------------

$capabilities = ['tools' => obj(['listChanged' => false])];

switch ($rpcMethod) {
  case 'initialize':
    if ($modern) rpc_error($id, ERR_METHOD_NOT_FOUND, 'initialize is not part of protocol ' . MODERN_VERSIONS[0] . '.', 404);
    $requested = $params['protocolVersion'] ?? null;
    $version = in_array($requested, LEGACY_VERSIONS, true) ? $requested : LEGACY_VERSIONS[0];
    rpc_result($id, [
      'protocolVersion' => $version,
      'capabilities' => $capabilities,
      'serverInfo' => SERVER_INFO,
      'instructions' => instructions(),
    ]);

  case 'server/discover':
    rpc_result($id, [
      'resultType' => 'complete',
      'supportedVersions' => MODERN_VERSIONS,
      'capabilities' => $capabilities,
      '_meta' => ['io.modelcontextprotocol/serverInfo' => SERVER_INFO],
      'instructions' => instructions(),
      'ttlMs' => 3600000,
      'cacheScope' => 'public',
    ]);

  case 'ping':
    finish($id, [], $modern);

  case 'tools/list':
    $result = ['tools' => tool_definitions()];
    if ($modern) $result += ['ttlMs' => 3600000, 'cacheScope' => 'public'];
    finish($id, $result, $modern);

  case 'tools/call':
    $name = $params['name'] ?? null;
    $args = is_array($params['arguments'] ?? null) ? $params['arguments'] : [];
    $result = match ($name) {
      'search' => tool_search($args),
      'get_now' => tool_get_now(),
      'list_notes' => tool_list_notes($args),
      'get_note' => tool_get_note($args),
      'list_musings' => tool_list_musings(),
      'get_musing' => tool_get_musing($args),
      default => null,
    };
    if ($result === null) rpc_error($id, ERR_INVALID_PARAMS, "Unknown tool: " . (is_string($name) ? $name : '(none)'), $modern ? 400 : 200);
    finish($id, $result, $modern);

  default:
    rpc_error($id, ERR_METHOD_NOT_FOUND, "Method not found: $rpcMethod", $modern ? 404 : 200);
}
