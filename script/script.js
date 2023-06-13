//https://www.d3indepth.com/geographic/

let projection = d3.geoMercator()
	.scale(1000)
	.translate([280, 280])
	.center([-102.559027 , 23.625376]);

let geoGenerator = d3.geoPath()
	.projection(projection);

function handleMouseover(e, d) {
	d3.select('#content .info')
		.text(d.properties.name);

    //get conso de coca par habitant from coca_conso_mexique.csv
    d3.csv("./data/coca_conso_mexique.csv")
        .then(function(data){
            //get data for the selected state
            let conso = data.filter(function(row){
                return row.nom == d.properties.name;
            });
            //get the conso value
            let conso_value = conso[0]; 
            if(conso_value == undefined){                
                d3.select("#stat_current").html("");
            }else{                  
                d3.select("#stat_current").html("");
                afficher_bouteille("#stat_current",conso_value.conso,litre_par_image);
            }
        });
}

function update(geojson) {
	let u = d3.select('#content g.map')
		.selectAll('path')
		.data(geojson.features);

	u.enter()
		.append('path')
		.attr('d', geoGenerator)
		.on('mouseover', handleMouseover);
        
        
    let paths = d3.select("g.map").selectAll("path");
    paths.each(function(d){
            if(d.properties.name == "Chiapas")
            {
                d3.select(this).attr("fill", "#cc3300");
            }
            else{
                d3.select(this).attr("fill", "#aaa");
            }
        });
    }

d3.json('./data/mexico.geojson')
	.then(function(json) {  
		update(json)
	});

function afficher_bouteille(nom_div,conso_l_par_personne,litre_par_image)
{
    for(let i = 0; i < conso_l_par_personne; i+= litre_par_image){
        //ajoute une image de coca à la div 
        d3.select(nom_div)
            .append("img")
            .attr("src", image_coca_path)
            .attr("width", "40px");
    }
    //ajout un texte pour la consommation de coca
    d3.select(nom_div)
        .append("p")
        .text(conso_l_par_personne + " litres");
}

//affiche les statistiques globales
//ajoute les images de coca en fonction du nombre de consommation
let litre_par_image = 10;
let image_coca_path = "./images/coca-cola.webp";
let conso_l_mexique_par_personne_par_an = 160;
let conso_l_france_par_personne_par_an = 32;
let conso_l_monde_par_personne_par_an = 20;

afficher_bouteille("#stat_mexique",conso_l_mexique_par_personne_par_an,litre_par_image);

afficher_bouteille("#stat_france",conso_l_france_par_personne_par_an,litre_par_image);

afficher_bouteille("#stat_monde",conso_l_monde_par_personne_par_an,litre_par_image);



