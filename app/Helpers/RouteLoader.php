<?php
// app/Helpers/RouteLoader.php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use Exception;

final class RouteLoader
{
  /**
   * Load route files dynamically while excluding specified files and
   * ensuring each file ends with 'Route.php'. Throw an error if a file
   * does not end with 'Route.php'.
   *
   * @param string $directory
   * @param array $excludeFileNames
   */
  public static function loadRouteFilesRecursively($directory, $excludeFileNames = [])
  {
    $iterator = new RecursiveIteratorIterator(
      new RecursiveDirectoryIterator($directory, RecursiveDirectoryIterator::SKIP_DOTS),
      RecursiveIteratorIterator::SELF_FIRST
    );

    foreach ($iterator as $file) {
      if ($file->isFile()) {
        if (!in_array($file->getFilename(), $excludeFileNames)) {
          if (Str::endsWith($file->getFilename(), 'Route.php')) {
            require $file->getPathname();
          } else {
            // Log and throw an exception
            $errorMessage = "The file '{$file->getFilename()}' does not end with 'Route.php'";
            Log::error($errorMessage);
            throw new Exception($errorMessage);
          }
        }
      }
    }
  }
}
