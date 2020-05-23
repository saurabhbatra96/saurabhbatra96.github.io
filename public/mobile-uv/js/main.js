function calcEef() {
    let ntn0 = document.getElementById("survival").value;
    let k = document.getElementById("k").value;
    let t = document.getElementById("t").value;
    let area = document.getElementById("area").value;
    let lampwjson = JSON.parse(document.getElementById("lampw").value);
    let lampw = lampwjson.w;
    let lampirr = lampwjson.irr;
    let uvexc = document.getElementById("uvexc").value;
    let refl = document.getElementById("refl").value;
    let h = parseFloat(document.getElementById("h").value);
    let theta = Math.PI*parseFloat(document.getElementById("theta").value)/180;

    let eef = -1*Math.log(parseFloat(ntn0))/(parseFloat(k)*parseFloat(t));
    let hef = eef*parseFloat(t);
    let tw = hef*parseFloat(area);

    let w = tw/parseFloat(t);
    let whg = w/0.35;
    let hgno = Math.ceil(whg/parseFloat(lampw));
    whg = lampw*hgno;

    let wmod = w-(parseFloat(uvexc)*w)+(parseFloat(refl)*w);
    let whgmod = wmod/0.35;
    let hgnomod = Math.ceil(whgmod/parseFloat(lampw));
    whgmod = lampw*hgnomod;

    let irrh = parseFloat(lampirr)/(h*h);
    let spread = Math.PI*(h*h)*(Math.tan(theta)*Math.tan(theta));
    let calcntno = Math.exp(-parseFloat(k)*irrh*parseFloat(t));

    document.getElementById("eef").value = eef.toString()+" W/m^2";
    document.getElementById("hef").value = hef.toString()+" W.s/m^2";
    document.getElementById("tw").value = tw.toString()+" W.s";
    document.getElementById("w").value = w.toString()+" W";
    document.getElementById("whg").value = whg.toString()+ " W";
    document.getElementById("hgno").value = hgno.toString();

    document.getElementById("wmod").value = wmod.toString()+" W";
    document.getElementById("whgmod").value = whgmod.toString()+" W";
    document.getElementById("hgnomod").value = hgnomod.toString();

    document.getElementById("irrh").value = irrh.toString()+" W/m^2";
    document.getElementById("spread").value = spread.toString()+" m^2";
    document.getElementById("calcntno").value = calcntno.toString();
}