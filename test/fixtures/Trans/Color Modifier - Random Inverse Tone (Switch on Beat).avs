Nullsoft AVS Preset 0.2-   �   O   dd = red * 1.5;
red = pow(dd, dr);
green = pow(dd, dg);
blue = pow(dd, db);        token = rand(99) % 3;
dr = if (equal(token, 0), -1, 1);
dg = if (equal(token, 1), -1, 1);
db = if (equal(token, 2), -1, 1);        