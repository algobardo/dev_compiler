// Copyright (c) 2015, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

/// Tests that run the checker end-to-end using the file system, but with a mock
/// SDK.
library dev_compiler.test.end_to_end;

import 'package:dev_compiler/devc.dart' show Compiler;
import 'package:dev_compiler/src/options.dart';
import 'package:test/test.dart';
import 'test_util.dart' show testDirectory;

main() {
  _check(testFile) {
    var options = new CompilerOptions(
        entryPointFile: '$testDirectory/$testFile.dart', useMockSdk: true);
    new Compiler(options).run();
  }

  test('checker runs correctly (end-to-end)', () {
    _check('samples/funwithtypes');
  });

  test('checker accepts files with imports', () {
    _check('samples/import_test');
  });

  test('checker tests function types', () {
    // TODO(vsm): Check for correct down casts.
    _check('samples/function_type_test');
  });

  test('checker tests runtime checks', () {
    // TODO(sigmund,vsm): Check output for invalid checks.
    _check('samples/runtimetypechecktest');
  });

  test('checker tests return values', () {
    // TODO(vsm): Check for conversions.
    _check('samples/return_test');
  });
}
