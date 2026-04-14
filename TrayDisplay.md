
## Puzzle的显示逻辑：
1. 只有verb stem：圆角长方形
2. 有verb stem 与verb end：
    - verb end:凸拼图，左边圆角长方形 + 右边半圆，长方形与半圆颜色相同
    - verb end:凹拼图,左边半圆（颜色与背景颜色相同）+右边圆角长方形

puzzle内部有文字，保证puzzle长度可以根据文字字数调整，可以包裹全部文字，文字要保证一定有大小。


## Tray显示逻辑

保证Tary可以包裹里面所有的Puzzles。
即使是凸拼图，凸出的半圆也能包裹在Tray 内，且凸拼图最右点与tray右边的距离 等于 tray左边框到拼图最左边的距离。



移动端：
1. 一个Tray，只有一个verb stem
- Tray内的puzzle 采用 1行 4列（1，4） 排列，之后都用这种显示方式
2. 两个Tray，有verb stem 与 verb end
- Tray pair，Tray内的puzzle 采用（4，1）排列，两个Tray水平并排。
3. 三个Tray，有aux stem，verb stem与verb end，或者有aux stem，aux end与verb stem
- 一个Tray的Tray内的puzzle 采用（1，4）排列，Tray pair 采用（2，2）排列。
更仔细地说：
如果是aux stem，verb stem与verb end，aux stem 第一行，verb stem与verb end第二行，两者垂直排列。verb stem与verb end第二行内部的Tray pair 水平排列。
如果是aux stem，aux end与verb stem的情况，aux stem，aux end第一行，verb stem第二行，两者垂直排列。aux stem，aux end第一行内部的Tray pair 水平排列。
4. 四个Tray，有aux stem，aux end，verb stem与verb end
就是两个tray pair。：每一个tray内部的puzzle采用（2，2）排列

桌面端：
1. 一个Tray，只有一个verb stem
- Tray内的puzzle 采用 1行 4列（1，4） 排列，之后都用这种显示方式
2. 两个Tray，有verb stem 与 verb end
- Tray pair，Tray内的puzzle 采用（2，2）排列，两个Tray水平并排。
3. 三个Tray 和 四个Tray
每一个Tray内的puzzle 采用（4，1）排列，tray之间水平并排。

目前有一个算法根据字数来调节puzzle与tray的算法，能不能再提升一下，可以根据显示设备的宽度，动态调节字体大小。从而调节puzzle宽度，然后是tray的宽度。保证视觉美观与清晰（配色不用改变）。