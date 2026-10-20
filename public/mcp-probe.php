<?php
// Temporary capability probe — removed once the MCP endpoint ships.
header('Content-Type: application/json');
header('Cache-Control: no-store');
echo json_encode([
  'php' => PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION,
  'method' => $_SERVER['REQUEST_METHOD'],
  'json' => function_exists('json_decode'),
  'mbstring' => function_exists('mb_strtolower'),
  'body_bytes' => strlen(file_get_contents('php://input')),
]);
