# ESP32 Workbench roadmap

## Goal

Grow esp-labs-web into a practical, single-user ESP32 development hub hosted on a Raspberry Pi 5. Keep the existing lessons, simulators, datasheet, and bench history useful as they are; add project workspaces and a carefully bounded local service for the development tasks a browser cannot safely do by itself.

The Pi is the trusted host and is physically connected to ESP32 boards over USB. A browser on the Pi or another device on the local network is the user interface. The browser does not directly run PlatformIO or gain unrestricted access to the Pi.

## Product and safety principles

- Start with one owner on a trusted home network. Require authentication before exposing project data or device operations; do not make an unauthenticated service reachable from the public internet.
- Keep the front end deployable as a static Vite bundle. Put filesystem, process, and serial-port access in a separate, small Pi-side service with an explicit API.
- Expose named, validated operations (list projects, build a selected environment, upload to a selected port), not a shell or arbitrary command endpoint.
- Show the selected project, environment, serial port, and operation before build/upload actions. Require explicit confirmation before flashing or other hardware-changing actions.
- Make project and build errors visible. Never report success when an operation failed or timed out.
- Keep project files on the Pi, use bounded file operations, reject paths outside the chosen workspace, and maintain recoverable backups.
- Describe what is local-only, what is backed up, and what is reachable over the network. Avoid sending project source or serial output to third-party services by default.
- Keep hardware-specific advice tied to a selected board profile; printed labels and board documentation take precedence over generic pin assumptions.
- Preserve responsive, keyboard-accessible UI, translation conventions, design tokens, strict TypeScript, and the repository's existing architecture and checks.

## Phases

### 0. Define and prepare the Pi deployment

- Document the supported Raspberry Pi OS, Node/runtime, PlatformIO installation, serial permissions, workspace location, and startup/update procedure.
- Decide the LAN exposure model: local-only or LAN-accessible, authentication method, HTTPS/reverse proxy, and firewall rules.
- Define operational limits: one active build/upload per board, operation timeout, log size/retention, storage limits, and backup schedule.
- Verify the currently static app works behind the intended Pi web server and subpath/base URL.

**Exit criteria:** A fresh Pi can be provisioned from written instructions; only intended LAN clients can access the app/service; no hardware operation is exposed without authentication and confirmation.

### 1. Make the project notebook a real Pi-backed workspace

- Replace or complement browser-only notebook records with projects stored on the Pi; keep the current local-only behavior until server persistence is ready.
- Add project create, rename, archive/delete, import/export, and list/search. Start from an explicitly configured workspace root.
- Store project metadata: name, board, framework/toolchain, PlatformIO environment, stage, wiring/pin map, notes, and timestamps.
- Provide downloadable project archives and restore. Back up metadata and project files; document what happens when storage is full or a backup fails.
- Treat project paths and imported archives as untrusted input. Prevent traversal, symlink escapes, oversized uploads, and accidental overwrite.
- Define how existing browser-local project notes migrate or export; do not silently discard them.

**Exit criteria:** Projects survive browser changes and Pi restarts; export/restore round-trips a project; unauthorized users cannot access project APIs; filesystem-boundary tests pass.

### 2. Add a safe PlatformIO build workflow

- Detect/check PlatformIO availability and report actionable setup/version diagnostics.
- Let a user choose a project and one of its declared `platformio.ini` environments.
- Build through a fixed operation in the Pi service, with validated arguments, a per-project working directory, concurrency limits, and a timeout.
- Stream or poll structured build output and progress; preserve failure exit status and make compiler errors easy to inspect.
- Record build time, environment, result, tool versions, and a bounded log in project history.
- Do not accept arbitrary shell text, arbitrary working directories, or arbitrary executable paths from the browser.

**Exit criteria:** A known sample project builds successfully on the Pi; invalid environments and failed builds are reported accurately; traversal, injection, timeout, and concurrent-build tests are covered.

### 3. Add board discovery, upload, and serial monitor

- Discover available serial devices and show a stable identifier and device path; never silently choose a port when more than one board is present.
- Add explicit port and baud selection, connection state, serial output, pause/clear, send-line input, and bounded downloadable session logs.
- Upload only a selected project/environment to a selected port using the supported PlatformIO operation. Require confirmation and show the target board and port before starting.
- Serialize uploads and monitor access where required, handle disconnects and permission errors, and keep each operation's result/history.
- Surface practical Pi guidance for USB power/cable, permissions, reset/boot buttons, and port conflicts.
- Do not imply the service can connect to a board attached to the remote browser's device; the board must be connected to the Pi for this architecture.

**Exit criteria:** A USB-connected test board can be discovered, flashed, and monitored from the LAN UI; disconnects and permission failures are clear; logs and operations are bounded.

### 4. Add a useful code and wiring workspace

- Add a project file tree, syntax-highlighted editor, file search, and safe create/rename/delete/save within the project root.
- Begin with single-user editing and visible save/error states; consider a mature editor library only after bundle size, mobile use, and dependency maintenance are evaluated.
- Add Git status/diff and commit/push only as a separate, explicit capability; never run repository operations on an untrusted path.
- Turn wiring notes into structured assignments (signal, board pin, peripheral pin, voltage/notes) while preserving free-form notes.
- Add board pinout selection, used-pin visualization, known strapping/reserved-pin warnings, and peripheral wiring diagrams with citations.
- Add a parts list that can be exported alongside the project.

**Exit criteria:** Editing cannot escape the workspace, unsaved changes are protected, pin conflicts are tested for supported boards, and the UI remains usable at phone width.

### 5. Add reusable project starters and development records

- Provide small, reviewed PlatformIO starters for the supported ESP32 families and common peripherals; show the board/framework and dependency versions used.
- Keep examples and setup instructions versioned and link hardware facts to authoritative documentation.
- Add per-project checklists for setup, wiring inspection, build, upload, and verification.
- Link build/upload events, serial logs, notes, and test outcomes in a project timeline.
- Add error lookup and troubleshooting guidance from observed compiler/device output, while keeping suggestions clearly distinguished from verified results.

**Exit criteria:** A starter project can be created, configured, built, and followed through a repeatable checklist without concealing dependency or hardware assumptions.

### 6. Add device inventory and optional OTA

- Track known boards, board profile, last connected time, and firmware/build identity only where the device can report or the user has recorded it.
- Consider OTA only after USB build/upload and device identity are reliable. Require explicit enrollment, network/authentication design, signed/verified firmware strategy where applicable, rollback/failure handling, and a clear per-device confirmation.
- Keep OTA off by default; it is not a substitute for safe physical recovery or USB flashing.

**Exit criteria:** Device records are honest about how data was obtained; OTA threat model, authorization, firmware integrity, failure recovery, and user confirmations are reviewed before implementation.

## Suggested milestones

1. **Pi MVP:** Phases 0–3: provisioned local service, Pi-backed projects, PlatformIO build/upload, and serial monitor.
2. **Daily-use workspace:** Phase 4: project editor, pinout/wiring view, and parts list.
3. **Polish and repeatability:** Phase 5: starters, checklists, and project history.
4. **Advanced remote workflows:** Phase 6 only after the MVP is secure and dependable.

## Cross-cutting validation for each implementation phase

- Add unit tests for pure project, validation, and pin-assignment logic; add API tests for authorization, path confinement, bounded inputs, and explicit error behavior.
- Run `pnpm check` and `pnpm build`, plus the relevant Pi service checks.
- Exercise the affected page in a real browser at desktop and 390px width; verify no horizontal overflow or console errors.
- Test the real workflow against a non-production sample project and a physically connected board before describing build/upload/serial as supported.
- Verify restart behavior, backup/restore, service failure, USB disconnect, and network access controls on the Pi.

## Not in the initial MVP

- Arbitrary terminal or remote shell access.
- Public internet exposure without a separately designed and reviewed security model.
- Multi-user collaboration, cloud synchronization, or third-party source-code uploads.
- OTA firmware rollout before device identity, authorization, and recovery are designed.
