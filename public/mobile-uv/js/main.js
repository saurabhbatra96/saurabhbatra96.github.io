function calcEef() {
    let ntn0 = document.getElementById("survival").value;
    let k = document.getElementById("k").value;
    let t = document.getElementById("t").value;
    let area = document.getElementById("area").value;
    let lampw = document.getElementById("lampw").value;

    let eef = -1*Math.log(parseFloat(ntn0))/(parseFloat(k)*parseFloat(t));
    let hef = eef*parseFloat(t);
    let tw = hef*parseFloat(area);
    let w = tw/parseFloat(t);
    let whg = w/0.35;
    let hgno = whg/parseFloat(lampw);

    document.getElementById("eef").value = eef.toString()+" W/m^2";
    document.getElementById("hef").value = hef.toString()+" W.s/m^2";
    document.getElementById("tw").value = tw.toString()+" W.s";
    document.getElementById("w").value = w.toString()+" W";
    document.getElementById("whg").value = whg.toString()+ " W";
    document.getElementById("hgno").value = hgno.toString();
}