Nullsoft AVS Preset 0.2+   �   /   x=x+(sin(y*dx) * .03);
y=y-(cos(x*dy) * .03); g   f = f + 1;
t = ((f * $pi * 2)/c)/beatdiv;
dt = dl + t;
dx = 14+(cos(dt)*8);
dy = 10+(sin(dt*2)*4);    c=f;f=0;dl=dt    c=200;f=0;dt=0;dl=0;beatdiv=8                             