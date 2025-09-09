import { BunPlatform_Argv_Includes } from '../src/lib/ericchase/BunPlatform_Argv_Includes.js';
import { Step_Dev_Format } from './core-dev/step/Step_Dev_Format.js';
import { Step_Dev_Project_Update_Config } from './core-dev/step/Step_Dev_Project_Update_Config.js';
import { Processor_HTML_Custom_Component_Processor } from './core-web/processor/Processor_HTML_Custom_Component_Processor.js';
import { Processor_HTML_Remove_HotReload_On_Build } from './core-web/processor/Processor_HTML_Remove_HotReload_On_Build.js';
import { Step_Run_Dev_Server } from './core-web/step/Step_Run_Dev_Server.js';
import { Builder } from './core/Builder.js';
import { Processor_Set_Writable } from './core/processor/Processor_Set_Writable.js';
import { Processor_TypeScript_Generic_Transpiler } from './core/processor/Processor_TypeScript_Generic_Transpiler.js';
import { Step_Bun_Run } from './core/step/Step_Bun_Run.js';
import { Step_FS_Clean_Directory } from './core/step/Step_FS_Clean_Directory.js';
import { Step_FS_Delete_Directory } from './core/step/Step_FS_Delete_Directory.js';
import { Step_FS_Move_Files } from './core/step/Step_FS_Move_Files.js';
import { Processor_Browser_Extension_Update_Manifest_Cache } from './lib-browser-extension/processors/Processor_Browser_Extension_Update_Manifest_Cache.js';
import { Step_Browser_Extension_Bundle } from './lib-browser-extension/steps/Step_Browser_Extension_Bundle.js';

// If needed, add `cache` directory to the logger's file writer.
// await AddLoggerOutputDirectory('cache');

// Use command line arguments to set developer mode.
if (BunPlatform_Argv_Includes('--dev')) {
  Builder.SetMode(Builder.MODE.DEV);
}
// Set the logging verbosity
Builder.SetVerbosity(Builder.VERBOSITY._1_LOG);

// These steps are run during the startup phase only.
Builder.SetStartUpSteps(
  Step_Dev_Project_Update_Config({ project_dir: '.' }),
  Step_Bun_Run({ cmd: ['bun', 'update', '--latest'], showlogs: false }),
  Step_Bun_Run({ cmd: ['bun', 'install'], showlogs: false }),
  //
);

if (Builder.GetMode() === Builder.MODE.BUILD) {
  Builder.AddStartUpSteps(
    Step_FS_Clean_Directory(Builder.Dir.Out),
    //
  );
}

// These steps are run before each processing phase.
Builder.SetBeforeProcessingSteps();

// Basic setup for a TypeScript project. TypeScript files that match
// "*.module.ts" and "*.iife.ts" are bundled and written to the out folder. The
// other TypeScript files do not produce bundles. Module scripts
// ("*.module.ts") will not bundle other module scripts. Instead, they'll
// import whatever exports are needed from other module scripts. IIFE scripts
// ("*.iife.ts"), on the other hand, produce fully contained bundles. They do
// not import anything from anywhere. Use them accordingly.

// HTML custom components are a lightweight alternative to web components made
// possible by the processor I wrote.

// The processors are run for every file that added them during every
// processing phase.
Builder.SetProcessorModules(
  Processor_HTML_Remove_HotReload_On_Build(),
  // Process the HTML custom components.
  Processor_HTML_Custom_Component_Processor(),
  // Process the manifest file.
  Processor_TypeScript_Generic_Transpiler({}, { include_patterns: ['manifest.ts'] }),
  Processor_Browser_Extension_Update_Manifest_Cache({ manifest_path: 'manifest.ts' }),
  Processor_Set_Writable({ include_patterns: ['manifest.ts'], value: false }),
  // Bundle the IIFE scripts and module scripts.
  // Processor_TypeScript_Generic_Bundler({ define: () => ({ 'process.env.SERVERHOST': DEV_SERVER_HOST }) }, { bundler_mode: 'iife' }),
  // Processor_TypeScript_Generic_Bundler({ define: () => ({ 'process.env.SERVERHOST': DEV_SERVER_HOST }) }, { bundler_mode: 'module' }),
  // Write non-bundle and non-library files. Exclude other files not wanted.
  Processor_Set_Writable({
    include_patterns: [
      // src
      'CommentsUtil.js',
      // src/original-repo
      'original-repo/plugin/**',
      //
    ],
    exclude_patterns: [
      // src/original-repo
      'original-repo/plugin/manifest.json',
      'original-repo/plugin/js/debugging/**',
      'original-repo/plugin/js/DebugUtil.js',
      'original-repo/plugin/js/parsers/Template.js',
      //
    ],
    value: true,
  }),
  //
);

if (Builder.GetMode() === Builder.MODE.DEV) {
  Builder.AddAfterProcessingSteps(
    Step_FS_Move_Files({
      include_patterns: ['**'],
      from_dir: `${Builder.Dir.Out}/original-repo/plugin`,
      into_dir: Builder.Dir.Out,
      overwrite: true,
      showlogs: false,
    }),
    // Step_FS_Delete_Directory(`${Builder.Dir.Out}/original-repo/plugin`),
    Step_Browser_Extension_Bundle({ release_dir: 'release' }),
    Step_Run_Dev_Server(),
  );
}

// These steps are run during the cleanup phase only.
Builder.SetCleanUpSteps(
  Step_FS_Move_Files({
    include_patterns: ['**'],
    from_dir: `${Builder.Dir.Out}/original-repo/plugin`,
    into_dir: Builder.Dir.Out,
    overwrite: true,
    showlogs: false,
  }),
  Step_FS_Delete_Directory(`${Builder.Dir.Out}/original-repo/plugin`),
  Step_Dev_Format({ showlogs: false }),
  Step_Browser_Extension_Bundle({ release_dir: 'release' }),
  //
);

await Builder.Start();
