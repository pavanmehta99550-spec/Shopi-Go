import { MobileTapDot } from '../types';

export function generateAdbScript(dots: MobileTapDot[], screenWidth = 1080, screenHeight = 2400): string {
  const commands = dots.map((dot) => {
    const x = Math.round((dot.xPercent / 100) * screenWidth);
    const y = Math.round((dot.yPercent / 100) * screenHeight);
    const delaySec = (dot.delayMs / 1000).toFixed(1);

    if (dot.action === 'tap') {
      return `echo "[AUTOTASKER] Executing Dot #${dot.order}: ${dot.label} (Tap at X:${x}, Y:${y})"\n` +
             `adb shell input tap ${x} ${y}\n` +
             `sleep ${delaySec}`;
    }

    if (dot.action === 'double_tap') {
      return `echo "[AUTOTASKER] Executing Dot #${dot.order}: Double Tap"\n` +
             `adb shell input tap ${x} ${y}\n` +
             `adb shell input tap ${x} ${y}\n` +
             `sleep ${delaySec}`;
    }

    if (dot.action === 'long_press') {
      return `echo "[AUTOTASKER] Executing Dot #${dot.order}: Long Press"\n` +
             `adb shell input swipe ${x} ${y} ${x} ${y} 1200\n` +
             `sleep ${delaySec}`;
    }

    if (dot.action === 'swipe_up') {
      const targetY = Math.round(y - 500);
      return `echo "[AUTOTASKER] Executing Dot #${dot.order}: Swipe Up"\n` +
             `adb shell input swipe ${x} ${y} ${x} ${targetY} 300\n` +
             `sleep ${delaySec}`;
    }

    return `sleep ${delaySec}`;
  }).join('\n\n');

  return `#!/bin/bash
# ========================================================
# AutoTasker Mobile Tap-Dot Macro ADB Script
# Phone Connection: USB Debugging Enabled (Developer Options)
# Screen Resolution Target: ${screenWidth}x${screenHeight}
# ========================================================

echo "Checking connected Android device..."
adb devices

echo "Starting autonomous tap sequence..."
${commands}

echo "Sequence execution finished successfully!"
`;
}

export function generatePythonMobileMacroScript(dots: MobileTapDot[], screenWidth = 1080, screenHeight = 2400): string {
  const stepsList = JSON.stringify(dots.map(d => ({
    order: d.order,
    label: d.label,
    x: Math.round((d.xPercent / 100) * screenWidth),
    y: Math.round((d.yPercent / 100) * screenHeight),
    action: d.action,
    delay: d.delayMs / 1000,
    repeats: d.repeatCount
  })), null, 2);

  return `# AutoTasker AI - Python Mobile Auto-Clicker & Tap Automation
# Prerequisites: pip install pure-python-adb OR adb installed on system
import subprocess
import time

DOTS = ${stepsList}

def execute_tap(x, y):
    subprocess.run(["adb", "shell", "input", "tap", str(x), str(y)])

def execute_swipe(x1, y1, x2, y2, duration=300):
    subprocess.run(["adb", "shell", "input", "swipe", str(x1), str(y1), str(x2), str(y2), str(duration)])

print("[AUTOTASKER] Starting mobile dot macro...")
for dot in DOTS:
    for r in range(dot['repeats']):
        print(f"[Dot #{dot['order']}] {dot['label']} -> Action: {dot['action']} at ({dot['x']}, {dot['y']})")
        if dot['action'] == 'tap':
            execute_tap(dot['x'], dot['y'])
        elif dot['action'] == 'double_tap':
            execute_tap(dot['x'], dot['y'])
            time.sleep(0.1)
            execute_tap(dot['x'], dot['y'])
        elif dot['action'] == 'long_press':
            execute_swipe(dot['x'], dot['y'], dot['x'], dot['y'], 1200)
        elif dot['action'] == 'swipe_up':
            execute_swipe(dot['x'], dot['y'], dot['x'], dot['y'] - 600, 300)
        
        time.sleep(dot['delay'])

print("[AUTOTASKER] Macro finished!")
`;
}
