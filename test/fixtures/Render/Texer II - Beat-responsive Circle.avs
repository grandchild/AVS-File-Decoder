Nullsoft AVS Preset 0.2P�� Acko.net: Texer II              r                                                                                                                                                                                                                                                                                         =   // This example needs Maximum render mode
n=30;newradius=.5;[   rotation=rotation+step;step=step*.9;
radius=radius*.9+newradius*.1;
point=0;
aspect=h/w;'   step=.05;
newradius=rand(100)*.005+.5;�   angle=rotation+point/n*$pi*2;
x=cos(angle)*radius*aspect;y=sin(angle)*radius;
red=sin(i*$pi*2)*.5+.5;green=1-red;blue=.5;
point=point+1;