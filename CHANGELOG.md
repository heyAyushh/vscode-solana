# Change Log
  
All notable changes to the 'vscode-anchor' extension will be documented in this file.  
  
## Version 0.2.6 [current]  
### What's Changed
* release candidate v0.2.6 by @heyAyushh in https://github.com/heyAyushh/vscode-anchor/pull/26
* setup one click environments with gitpod and github codespaces
* vscode-anchor extension is now also published to https://github.com/eclipse/openvsx,  
this means now it is microsoft vendor free and can be used in environments where ovsx is supported

### Added  
- gitpod one click button in readme
- Consent to Install Solana
- vscode-anchor custom solana binaries path in settings
- anchor install and use installed version automatically

### Bug Fixes
- Program Item default action was not working #22 
- extension size has been reduced by 90% 

**Full Changelog**: https://github.com/heyAyushh/vscode-anchor/compare/v0.2.4...v0.2.6

## Version 0.2.4 
### Added  
- Support for Anchor Version Manager (avm)
- Scaffolding projects Improvements #12
- Test against local validator
  
### Changed  
- Install command now uses avm to install Anchor and Other versions.  
- Edit buttons on views for programs and tests are now replaced with default name click to open file.
  
### Fixed  
- Anchor tests were not visible in pane #13
  
---
## Version 0.2.3 
### Added  
- Added Help Commands to your favourite docs site.
- Analyze your code with Soteria, Cargo Audit, and clippy.
- Fixed Build Verifiable Command.  
  
---  
## Version 0.2.2  
### Added  
- Anchor cli commands to vscode.
- Install anchor cli if not found.
- Anchor container view with programs and tests.  

---
## Version 0.1.0  
### Added  

- Initialised extension
- Scaffolded Structure
- CODE_OF_CONDUCT
- pull_request_template
- README.md (donate and contributions)
