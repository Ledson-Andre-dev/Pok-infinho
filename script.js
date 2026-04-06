const inputPesquisa = document.getElementById('barra_pesquisa');
const btnPesquisa = document.getElementById('btn-pesquisa');

//secao_1
const nomepokemon = document.getElementById('nome-pokemon');
const seletorFormas = document.getElementById('seletor-formas');
const imgPokemon = document.getElementById('img-pokemon');

const HP = document.getElementById('HP')
const Ataque = document.getElementById('Ataque')
const Defesa = document.getElementById('Defesa')
const Velocidade = document.getElementById('Velocidade')
const AtqEsp = document.getElementById('AtqEsp')
const DefEsp = document.getElementById('DefEsp')

//secao_2
const  containertipo = document.getElementById('container-tipo')
const  selecaohabilidade = document.getElementById('selecao-habilidade')
const  habilidade = document.getElementById('habilidade')

//secao_3
const celulaNationalN = document.getElementById('celula_National-N');
const celulaEspecie = document.getElementById('celula_Especie');
const celulaAltura = document.getElementById('celula_Altura');
const celulaPeso = document.getElementById('celula_Peso');

const nomesCorrigidos = {
    'giratina': 'giratina-altered',
    'deoxys': 'deoxys-normal',
    'shaymin': 'shaymin-land',
    'aegislash': 'aegislash-shield',
    'keldeo': 'keldeo-ordinary',
    'meloetta': 'meloetta-aria',
    'tornadus': 'tornadus-incarnate',
    'thundurus': 'thundurus-incarnate',
    'landorus': 'landorus-incarnate',
    'lycanroc': 'lycanroc-midday',
    'wishiwashi': 'wishiwashi-solo',
    'mimikyu': 'mimikyu-disguised',
    'toxtricity': 'toxtricity-amped',
    'eiscue': 'eiscue-ice',
    'morpeko': 'morpeko-full-belly',
    'urshifu': 'urshifu-single-strike'
};

let dadosPokemon = null;

function desenharGraficoHexagono(hp, atk, def, spd, spa, spdef) {
    const max = 255; 

    const pHP = hp / max;
    const pAtk = atk / max;
    const pDef = def / max;
    const pSpd = spd / max;
    const pSpA = spa / max;
    const pSpD = spdef / max;

    const x1 = 50,                  y1 = 50 - (50 * pHP);  
    const x2 = 50 + (50 * pAtk),    y2 = 50 - (25 * pAtk); 
    const x3 = 50 + (50 * pDef),    y3 = 50 + (25 * pDef); 
    const x4 = 50,                  y4 = 50 + (50 * pSpd); 
    const x5 = 50 - (50 * pSpA),    y5 = 50 + (25 * pSpA); 
    const x6 = 50 - (50 * pSpD),    y6 = 50 - (25 * pSpD); 


    const novoPoligono = `polygon(${x1}% ${y1}%, ${x2}% ${y2}%, ${x3}% ${y3}%, ${x4}% ${y4}%, ${x5}% ${y5}%, ${x6}% ${y6}%)`;


    document.getElementById('hexagono-fill').style.clipPath = novoPoligono;
    
}

async function buscarPokemon(nomeOuId) {
    try {
        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomeOuId}`);
       
        dadosPokemon = await resposta.json();

    imgPokemon.src = dadosPokemon.sprites?.other?.['official-artwork']?.front_default || 
                     dadosPokemon.sprites?.other?.home?.front_default || 
                     dadosPokemon.sprites?.front_default || 
                     'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';

    const tiposAntigos = containertipo.querySelectorAll('.badge-tipo');
    tiposAntigos.forEach(tipo => tipo.remove());

    dadosPokemon.types.forEach(tipoInfo => {
        
        const novaDiv = document.createElement('div');
        const novoP = document.createElement('p');

        const nomeTipo = tipoInfo.type.name;

        novaDiv.classList.add('badge-tipo', nomeTipo);
        novoP.classList.add('nome-tipo');

        novoP.innerText = nomeTipo.toUpperCase();

        novaDiv.appendChild(novoP);

        containertipo.appendChild(novaDiv);
            
    });

    const habilidadesAntigas = selecaohabilidade.querySelectorAll('.btn-habilidade');
    habilidadesAntigas.forEach(tipo => tipo.remove());
    habilidade.innerText = "Descrição não encontrada.";

    dadosPokemon.abilities.forEach((habilidadeInfo, index) =>{

        const novoBtn = document.createElement('button');

        novoBtn.classList.add('btn-habilidade');

        novoBtn.innerText = habilidadeInfo.ability.name;

        novoBtn.addEventListener('click', async (event) =>{
            habilidade.innerText = "Carregando descrição...";
                
                try {
                    const respostaHabilidade = await fetch(habilidadeInfo.ability.url);
                    const dadosDaHabilidade = await respostaHabilidade.json();

                    const textoEmIngles = dadosDaHabilidade.effect_entries.find(
                        entrada => entrada.language.name === 'en'
                    );

                    if (textoEmIngles) {
                        habilidade.innerText = textoEmIngles.effect.replace(/[\n\f]/g, ' ');
                    } 
                    else {
                        habilidade.innerText = "Descrição não encontrada.";
                    }

                } catch (erro) {
                    habilidade.innerText = "Erro ao buscar a habilidade.";
                } 
        });

        selecaohabilidade.appendChild(novoBtn);

        if (index === 0) {
            novoBtn.click();
        }

    })
    
    celulaNationalN.innerText = dadosPokemon.id;
    
    const respostaEspecie = await fetch(dadosPokemon.species.url);
    const dadosEspecie = await respostaEspecie.json(); 

    const especieEmIngles = dadosEspecie.genera.find(genero => genero.language.name === 'en');

    celulaEspecie.innerText = especieEmIngles.genus;  
    celulaAltura.innerText = `${dadosPokemon.height / 10} m`;
    celulaPeso.innerText = `${dadosPokemon.weight / 10} kg`
    
    const valorHP = dadosPokemon.stats[0].base_stat;
    const valorAtk = dadosPokemon.stats[1].base_stat;
    const valorDef = dadosPokemon.stats[2].base_stat;
    const valorSpA = dadosPokemon.stats[3].base_stat; 
    const valorSpD = dadosPokemon.stats[4].base_stat; 
    const valorSpd = dadosPokemon.stats[5].base_stat; 

    HP.innerText = valorHP;
    Ataque.innerText = valorAtk;
    Defesa.innerText = valorDef;
    AtqEsp.innerText = valorSpA;
    DefEsp.innerText = valorSpD;
    Velocidade.innerText = valorSpd;


    desenharGraficoHexagono(valorHP, valorAtk, valorDef, valorSpd, valorSpA, valorSpD);
       
        seletorFormas.innerHTML = '';

        
        if (dadosEspecie.varieties.length > 1) {
            
            nomepokemon.style.display = 'none';
            seletorFormas.style.display = 'block';

            dadosEspecie.varieties.forEach(variedade => {
                const opcao = document.createElement('option');
                opcao.value = variedade.pokemon.name; 
                
                opcao.innerText = variedade.pokemon.name.replace(/-/g, ' ');

              
                if (variedade.pokemon.name === dadosPokemon.name) {
                    opcao.selected = true;
                }

                seletorFormas.appendChild(opcao);
            });
            
        } else {
           
            seletorFormas.style.display = 'none';
            nomepokemon.style.display = 'block';
            nomepokemon.innerText = dadosPokemon.name;
        }

    } catch (erro) {
        console.error("Erro na busca:", erro);
    }
}

seletorFormas.addEventListener('change', async (event) => {
buscarPokemon(event.target.value);
})

    
btnPesquisa.addEventListener('click', async (event) => {
    event.preventDefault(); 

    let pokemonBuscado = inputPesquisa.value.toLowerCase();
    
    if (nomesCorrigidos[pokemonBuscado]) {
        pokemonBuscado = nomesCorrigidos[pokemonBuscado];
    }

    buscarPokemon(pokemonBuscado); 

    
});


buscarPokemon('bulbasaur');

