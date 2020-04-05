function adicionarTec() {
    var val = $("input#tec").val();
    var ul = $("ul#tec");
    var html = "<li class=\"list-group-item\">" + val + "</ul>";
    var html = ul.html() + html;
    ul.html(html);
}
function adicionarTs() {
    var val = $("input#ts").val();
    var ul = $("ul#ts");
    var html = "<li class=\"list-group-item\">" + val + "</ul>";
    var html = ul.html() + html;
    ul.html(html);
}

function limpar() {
    $("input[type=text]").val("");
    $("ul#ts").html("");
    $("ul#tec").html("");
    $(".resultado-1 tbody").html("");

    $(".resultado-1 tfoot tr td:eq(3)").html("");
    $(".resultado-1 tfoot tr td:eq(5)").html("");
    $(".resultado-1 tfoot tr td:eq(7)").html("");
    $(".resultado-1 tfoot tr td:eq(8)").html("");

    $("#total-clientes").html("");
    $("#media-espera").html("");
    $("#probabilidade-cliente-fila").html("");
    $("#probabilidade-operador-livre").html("");
    $("#media-servico").html("");
    $("#tempo-medio-gasto").html("");
}

function simular() {
    var table = $(".resultado-1 tbody");
    table.html("");
    var tempoLimite = $("input#tempo").val();

    var cliente = 0;
    var tempoDesdeAUltimaChegada = 0;
    var tempoDeChagadaNoRelogio = 0;
    var tempoDeServico = 0;
    var tempoDeInicioDoServicoNoRelogio = 0;
    var tempoDoClienteNaFila = 0;
    var tempoFinalDoServicoNoRelogio = 0;
    var tempoDoClienteNoSistema = 0;
    var tempoLivreDoOperador = 0;

    var tempoTotalDeEsperaNaFila = 0;
    var tempoTotalDoOperadorLivre = 0;
    var tempoTotalDoServico = 0;
    var tempoTotalDoClienteNoSistema = 0;

    while (tempoDeChagadaNoRelogio < tempoLimite) {
        tempoDesdeAUltimaChegada = parseInt(pegarValorTEC());
        tempoDeServico = parseInt(pegarValorTS());
        tempoTotalDoServico += tempoDeServico;
        tempoDeChagadaNoRelogio = tempoDeChagadaNoRelogio + tempoDesdeAUltimaChegada;

        var tempoChegada = 0;

        tempoClienteNaFila = 0;
        if (cliente > 1) {
            var x = parseInt(table.find("tr:last td:eq(2)").html());
            if (x > tempoChegada) {
                tempoClienteNaFila = x - tempoChegada;
            }
        }

        if (cliente == 0) {
            tempoDeInicioDoServicoNoRelogio = tempoDesdeAUltimaChegada;
            tempoFinalDoServicoNoRelogio = tempoDeInicioDoServicoNoRelogio + tempoDeServico;
            tempoLivreDoOperador = tempoDeChagadaNoRelogio;
        }

        if (cliente > 0) {
            var x = parseInt(table.find("tr:last td:eq(6)").html());
            tempoDoClienteNaFila = 0;
            if (x > tempoDeChagadaNoRelogio) {
                tempoDoClienteNaFila = x - tempoDeChagadaNoRelogio;
            }

            tempoTotalDeEsperaNaFila += tempoDoClienteNaFila;

            tempoDeInicioDoServicoNoRelogio = tempoDoClienteNaFila + tempoDeChagadaNoRelogio;

            tempoFinalDoServicoNoRelogio = tempoDeServico + tempoDeInicioDoServicoNoRelogio;

            tempoLivreDoOperador = 0;
            if (x < tempoDeChagadaNoRelogio) {
                tempoLivreDoOperador = tempoDeChagadaNoRelogio - x;
            }
            tempoTotalDoOperadorLivre += tempoLivreDoOperador;
        }

        tempoDoClienteNoSistema = tempoFinalDoServicoNoRelogio - tempoDeChagadaNoRelogio;
        tempoTotalDoClienteNoSistema += tempoDoClienteNoSistema;

        if (cliente > 0) {
            tempoFinalDoServicoNoRelogio = tempoDeInicioDoServicoNoRelogio + tempoDeServico;
        }
        tempoInicioServico = (tempoClienteNaFila + tempoChegada);
        var html = "<tr>";
        html += "<td>" + (++cliente) + "</td>";
        html += "<td>" + tempoDesdeAUltimaChegada + "</td>";
        html += "<td>" + tempoDeChagadaNoRelogio + "</td>";
        html += "<td>" + tempoDeServico + "</td>";
        html += "<td>" + tempoDeInicioDoServicoNoRelogio + "</td>";
        var dataClienteEmFila = "";
        if (tempoDoClienteNaFila > 0) {
            dataClienteEmFila = "data-cliente-na-fila=\"true\"";
        }
        html += "<td " + dataClienteEmFila + ">" + tempoDoClienteNaFila + "</td>";
        html += "<td>" + tempoFinalDoServicoNoRelogio + "</td>";
        html += "<td>" + tempoDoClienteNoSistema + "</td>";
        html += "<td>" + tempoLivreDoOperador + "</td>";
        html += "</tr>";
        table.html(table.html() + html);
    }

    $(".resultado-1 tfoot tr td:eq(3)").html(tempoTotalDoServico);
    $(".resultado-1 tfoot tr td:eq(5)").html(tempoTotalDeEsperaNaFila);
    $(".resultado-1 tfoot tr td:eq(7)").html(tempoTotalDoClienteNoSistema);
    $(".resultado-1 tfoot tr td:eq(8)").html(tempoTotalDoOperadorLivre);

    var quantidadeClienteEmFila = $("td[data-cliente-na-fila=true]").length;
    $("#total-clientes").html(cliente);
    $("#media-espera").html((tempoTotalDeEsperaNaFila / cliente).toFixed(2));
    $("#probabilidade-cliente-fila").html((quantidadeClienteEmFila / cliente).toFixed(2));
    $("#probabilidade-operador-livre").html((tempoTotalDoOperadorLivre / tempoFinalDoServicoNoRelogio).toFixed(2));
    $("#media-servico").html((tempoTotalDoServico / cliente).toFixed(2));
    $("#tempo-medio-gasto").html((tempoTotalDoClienteNoSistema / cliente).toFixed(2));

}

function pegarValorTEC() {
    var ulTecLi = $("ul#tec li");
    var MAX = ulTecLi.length;
    var x = Math.floor((Math.random() * MAX)) - 1;
    return $("ul#tec li:eq(" + x + ")").html();
}

function pegarValorTS() {
    var ulTecLi = $("ul#ts li");
    var MAX = ulTecLi.length;
    var x = Math.floor((Math.random() * MAX)) - 1;
    return $("ul#ts li:eq(" + x + ")").html();
}