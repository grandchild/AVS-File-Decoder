Nullsoft AVS Preset 0.2$   �  B   r=if(b,0,((i*dv)*3.14159*128)+(t/2));
x=cos(r)*sz;
y=sin(r)*sz; �   f=f+1;t=(f*3.1415*2)/c;
sz=abs(sin(t-3.1415));
dv=if(below(n,12),(n/2)-1,
    if(equal(12,n),3,
    if(equal(14,n),6,
    if(below(n,20),2,4)))) �   bb = bb + 1;
beatdiv = 8;
c=if(equal(bb%beatdiv,0),f,c);
f=if(equal(bb%beatdiv,0),0,f);
g=if(equal(bb%beatdiv,0),g+1,g);
n=if(equal(bb%beatdiv,0),(abs((g%17)-8) *2)+4,n); #   n=20;t=0;f=0;c=200;mn=10;dv=2;dn=0       ���     