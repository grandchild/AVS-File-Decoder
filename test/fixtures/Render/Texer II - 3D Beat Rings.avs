Nullsoft AVS Preset 0.2P�� Acko.net: Texer II              �                                                                                                                                                                                                                                                                                         �   // This shows how to use texer for 3D particles
// Additive or maximum blend mode should be used
xr=(rand(50)/500)-0.05;
yr=(rand(50)/500)-0.05;
zr=(rand(50)/500)-0.05;�   // Rotation along x/y/z axes
xt=xt+xr;yt=yt+yr;zt=zt+zr;
// Shrink rings
bt=max(0,bt*.95+.01);
// Aspect correction
asp=w/h;
// Dynamically adjust particle count based on ring size
n=((bt*40)|0)*3;�   // New rotation speeds
xr=(rand(50)/500)-0.05;
yr=(rand(50)/500)-0.05;
zr=(rand(50)/500)-0.05;
// Ring size
bt=1.2;
n=((bt*40)|0)*3;Y  // 3D object
x1=sin(i*$pi*6)/2*bt;
y1=above(i,.66)-below(i,.33);
z1=cos(i*$pi*6)/2*bt;

// 3D rotations
x2=x1*sin(zt)-y1*cos(zt);y2=x1*cos(zt)+y1*sin(zt);
z2=x2*cos(yt)+z1*sin(yt);x3=x2*sin(yt)-z1*cos(yt);
y3=y2*sin(xt)-z2*cos(xt);z3=y2*cos(xt)+z2 *sin(xt);

// 2D Projection
iz=1/(z3+2);
x=x3*iz;y=y3*iz*asp;
sizex=iz*2;sizey=iz*2;