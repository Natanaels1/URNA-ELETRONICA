//CONTROLES DE INTERFACE
let seuVotoPara = document.querySelector('.d-1-1 span');
let cargo = document.querySelector('.d-1-2 span');
let descricao = document.querySelector('.d-1-4');
let aviso = document.querySelector('.d-2');
let lateral = document.querySelector('.d-1-right');
let numeros = document.querySelector('.d-1-3');

//VARIAVEIS DE AMBIENTE
let etapaAtual = 0;
let numero = '';
let votoEmBranco = false;
let votos = [];
let votoNulo = false;

let contagemVereador = JSON.parse(localStorage.getItem('contagem-Vereador')) || [];
let contagemPrefeito = JSON.parse(localStorage.getItem('contagem-Prefeito')) || [];

function comecarEtapa() {
    let etapa = etapas[etapaAtual]

    let numeroHTML = '';
    numero = '';
    votoEmBranco = false;

    for(let i = 0; i < etapa.numeros; i++) {
       if(i === 0) {
           numeroHTML += '<div class="numero pisca"></div>';
       } else {
        numeroHTML += '<div class="numero"></div>';
       }
    }

    seuVotoPara.style.display = 'none';
    cargo.innerHTML = etapa.titulo;
    descricao.innerHTML = '';
    aviso.style.display = 'none';
    lateral.innerHTML = '';
    numeros.innerHTML = numeroHTML;
}

function atualizaInterface() {
    let etapa = etapas[etapaAtual];
    let candidato = etapa.candidatos.filter((item)=>{
        if(item.numero === numero) {
            return true;
        } else {
            return false;
        }
    });
    if(candidato.length > 0) {
        candidato = candidato[0];

        seuVotoPara.style.display = 'block';
        descricao.innerHTML = `Nome: ${candidato.nome}<br /> Partido: ${candidato.partido}`;
        aviso.style.display = 'block';

        let fotosHtml = '';
        for(let i in candidato.fotos) {
            fotosHtml += `<div class="d-1-image princ">
            <img class="foto-tam" src="imagens/${candidato.fotos[i].url}" alt="" />
            ${candidato.fotos[i].legenda}
            </div>`
        }

        lateral.innerHTML = fotosHtml;
    } else {
        votoNulo = true;
        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        descricao.innerHTML = '<div class="aviso-grande pisca">VOTO NULO</div>';
    }

}


//FUNÇÕES
function clicou(n) {
    let elNumero = document.querySelector('.numero.pisca');
    if(elNumero !== null) {
        elNumero.innerHTML = n;
        numero = `${numero}${n}`;

        elNumero.classList.remove('pisca');
        if(elNumero.nextElementSibling !== null) {
            elNumero.nextElementSibling.classList.add('pisca');
        } else {
            atualizaInterface()
        }
    }
}

function branco() {
        numero = '';
        votoEmBranco = true;
        lateral.innerHTML = '';

        seuVotoPara.style.display = 'block';
        aviso.style.display = 'block';
        numeros.innerHTML = '';
        descricao.innerHTML = '<div class="aviso-grande pisca">VOTO EM BRANCO</div>'
}

function corrige() {
    comecarEtapa()
 }

function confirma() {
    let etapa = etapas[etapaAtual];

    let votoConfirmado = false;

    if(votoEmBranco === true) {
        votoConfirmado = true;
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: 'Branco'
        });
    } else if(votoNulo === true ){
        votoConfirmado = true;
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: 'Nulo'
        });
    } else if(numero.length === etapa.numeros) {
        votoConfirmado = true;
        votos.push({
            etapa: etapas[etapaAtual].titulo,
            voto: numero
        });
    }
    

    if(votoConfirmado) {
        etapaAtual++;
        if(etapas[etapaAtual] !== undefined) {
            comecarEtapa()
        } else {
            document.querySelector('.tela').innerHTML = '<div class="aviso-grande fim pisca">FIM!</div>'; 

            salvar()
        } 
    }

    function salvar() {
        contagemVereador.push(votos[0].voto);
        contagemPrefeito.push(votos[1].voto);
       

        /* console.log(votosVereador)
        console.log(votosPrefeito)  */
        
        localStorage.setItem('contagem-Vereador', JSON.stringify(contagemVereador));
        localStorage.setItem('contagem-Prefeito', JSON.stringify(contagemPrefeito));
    }
}

comecarEtapa();

//BOTÃO RECARREGAR PAGINA
function outraPessoa() {
  location.reload()          
} 

function contador() {
  //VISUALIZAÇÃO DOS VOTOS EM FORMATO DE ARRAY NO CONSOLE VINDO DO LOCALSTORAGE
    let armazenarVereador = JSON.parse(localStorage.getItem('contagem-Vereador'));
    let armazenarPrefeito = JSON.parse(localStorage.getItem('contagem-Prefeito'));

    //FILTRO DE VOTO NULO E BRANCO
    let resultadoVereador = armazenarVereador.filter(item => item !== "Nulo" && item !== "Branco");
    let resultadoPrefeito = armazenarPrefeito.filter(item => item !== "Nulo" && item !== "Branco");

    console.log(resultadoVereador);
    console.log(resultadoPrefeito);

    //FILTRO DE SEPARAÇÃO DOS VOTOS/VEREADOR
    const votosVereador1 = resultadoVereador.filter(item => item === "11111");
    const votosVereador2 = resultadoVereador.filter(item => item === "22222");

    console.log(`Vereador 1 recebeu: ` + votosVereador1.length + ` votos.`);
    console.log(`Vereador 2 recebeu: ` + votosVereador2.length + ` votos.`);

    //FILTRO DE SEPARAÇÃO DOS VOTOS/PREFEITO
    const votosPrefeito1 = resultadoPrefeito.filter(item => item === "11");
    const votosPrefeito2 = resultadoPrefeito.filter(item => item === "22");

    console.log(`Prefeito 1 recebeu: ` + votosPrefeito1.length + ` votos.`);
    console.log(`Prefeito 2 recebeu: ` + votosPrefeito2.length + ` votos.`);

    //AVISO DE ELEIÇÃO ENCERRADA, VOTOS E RESULTADOS EXIBIDOS NO CONSOLE.
    cargo.innerHTML = '';
    seuVotoPara.style.display = 'none';
    aviso.style.display = 'none';
    numeros.innerHTML = '';
    descricao.innerHTML = '<div class="aviso-grande pisca">ELEIÇÃO ENCERRADA!</div>'

    //EXIBINDO VEREADOR ELEITO
    if(votosVereador1.length > votosVereador2.length) {
      //Vereador 2 eleito
      console.log('Vereador 1 eleito')

    } else if (votosVereador1.length < votosVereador2.length) {
        //Vereador 2 eleito
        console.log('Vereador 2 eleito')
    } else {
        //Empate
        console.log('Eleições terminaram empatadas')
    }

     //EXIBINDO PREFEITO ELEITO
     if(votosPrefeito1.length > votosPrefeito2.length) {
        //Vereador 1 eleito com tantos votos
        console.log('Prefeito 1 eleito')
    } else if (votosPrefeito1.length < votosPrefeito2.length) {
        //Vereador 2 eleito
        console.log('Prefeito 2 eleito')
    } else {
        //Empate
        console.log('Eleições terminaram empatadas')
    }
}
