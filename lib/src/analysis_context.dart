// Copyright (c) 2015, the Dart project authors.  Please see the AUTHORS file
// for details. All rights reserved. Use of this source code is governed by a
// BSD-style license that can be found in the LICENSE file.

library dev_compiler.src.analysis_context;

import 'package:analyzer/file_system/file_system.dart';
import 'package:analyzer/file_system/memory_file_system.dart';
import 'package:analyzer/src/generated/engine.dart';
import 'package:analyzer/src/generated/java_io.dart' show JavaFile;
import 'package:analyzer/src/generated/sdk_io.dart' show DirectoryBasedDartSdk;
import 'package:analyzer/src/generated/source.dart' show DartUriResolver;
import 'package:analyzer/src/generated/source_io.dart';
import 'package:path/path.dart' as path;

import 'checker/resolver.dart';
import 'dart_sdk.dart';
import 'multi_package_resolver.dart';
import 'options.dart';

/// Creates an AnalysisContext with dev_compiler type rules and inference.
///
/// Use [options.useMockSdk] to specify the SDK mode, or use [sdkResolver]
/// to entirely override the DartUriResolver.
///
/// If supplied, [fileResolvers] will override the default `file:` and
/// `package:` URI resolvers.
///
AnalysisContext createAnalysisContext(CompilerOptions options,
    {DartUriResolver sdkResolver, List fileResolvers}) {
  var context = _initContext(options);

  var sdkResolver = options.useMockSdk
      ? createMockSdkResolver(mockSdkSources)
      : createSdkPathResolver(options.dartSdkPath);

  var resolvers = [];
  if (options.customUrlMappings.isNotEmpty) {
    resolvers.add(new CustomUriResolver(options.customUrlMappings));
  }
  resolvers.add(sdkResolver);
  if (options.useImplicitHtml) {
    resolvers.add(_createImplicitEntryResolver(options));
  }
  if (fileResolvers == null) {
    fileResolvers = [new FileUriResolver()];
    fileResolvers.add(options.useMultiPackage
        ? new MultiPackageResolver(options.packagePaths)
        : new PackageUriResolver([new JavaFile(options.packageRoot)]));
  }
  resolvers.addAll(fileResolvers);
  context.sourceFactory = new SourceFactory(resolvers);
  return context;
}

/// Creates a [DartUriResolver] that uses a mock 'dart:' library contents.
DartUriResolver createMockSdkResolver(Map<String, String> mockSources) =>
    new MockDartSdk(mockSources, reportMissing: true).resolver;

/// Creates a [DartUriResolver] that uses the SDK at the given [sdkPath].
DartUriResolver createSdkPathResolver(String sdkPath) =>
    new DartUriResolver(new DirectoryBasedDartSdk(new JavaFile(sdkPath)));

UriResolver _createImplicitEntryResolver(ResolverOptions options) {
  var entry = path.absolute(ResolverOptions.implicitHtmlFile);
  var src = path.absolute(options.entryPointFile);
  var provider = new MemoryResourceProvider();
  provider.newFile(
      entry, '<body><script type="application/dart" src="$src"></script>');
  return new ExistingSourceUriResolver(new ResourceUriResolver(provider));
}

/// A UriResolver that continues to the next one if it fails to find an existing
/// source file. This is unlike normal URI resolvers, that always return
/// something, even if it is a non-existing file.
class ExistingSourceUriResolver implements UriResolver {
  final UriResolver resolver;
  ExistingSourceUriResolver(this.resolver);

  Source resolveAbsolute(Uri uri) {
    var src = resolver.resolveAbsolute(uri);
    return src.exists() ? src : null;
  }
  Uri restoreAbsolute(Source source) => resolver.restoreAbsolute(source);
}

/// Creates an analysis context that contains our restricted typing rules.
AnalysisContext _initContext(ResolverOptions options) {
  var analysisOptions = new AnalysisOptionsImpl()..cacheSize = 512;
  AnalysisContextImpl res = AnalysisEngine.instance.createAnalysisContext();
  res.analysisOptions = analysisOptions;
  res.libraryResolverFactory =
      (context) => new LibraryResolverWithInference(context, options);
  return res;
}
