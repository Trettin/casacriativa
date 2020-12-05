//usei o express pra criar e configurar meu servidor
const express = require('express')
const server = express()

const db = require("./db")

/* const ideas = [
    {
        img: "https://www.flaticon.com/svg/static/icons/svg/1688/1688400.svg",
        title: "Cursos de Programação",
        category: "Estudo",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia nesciunt",
        url: "https://rocketseat.com.br"
    },
    {
        img: "https://www.flaticon.com/svg/static/icons/svg/1140/1140824.svg",
        title: "Ginástica funcional",
        category: "Saúde",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia nesciunt",
        url: "https://rocketseat.com.br"
    },
    {
        img: "https://www.flaticon.com/svg/static/icons/svg/2061/2061348.svg",
        title: "Aula de meditação",
        category: "Saúde",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia nesciunt",
        url: "https://rocketseat.com.br"
    },
    {
        img: "https://www.flaticon.com/svg/static/icons/svg/2737/2737393.svg",
        title: "Tocar violão",
        category: "Lazer",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia nesciunt",
        url: "https://rocketseat.com.br"
    }
]
 */


//configurar arquivos estáticos (CSS, scripts, imagens)
server.use(express.static("public"))

// habilitar uso do req.body
server.use(express.urlencoded({ extended: true}))

//configuração do nunjucks
const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true,
})

//criei uma rota /
//e capturo o pedido do cliente para responder
server.get("/", function(req, res) {
    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados")
        }

        const reversedIdeas = [...rows].reverse()

        let lastIdeas = []
        for (let idea of reversedIdeas) {
            if (lastIdeas.length < 2) {
                lastIdeas.push(idea)
            }
        }
    
        return res.render("index.html", {ideas: lastIdeas })
    })

})

server.get("/ideias", function(req, res) {

    db.all(`SELECT * FROM ideas`, function(err, rows) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados")
        }

        const reversedIdeas = [...rows].reverse()
        
        return res.render("ideias.html", { ideas: reversedIdeas})
    })

})

server.post("/", function(req, res) {
       // Inserir um dado na tabela
    const query = `
    INSERT INTO ideas(
        image,
        title, 
        category,
        description,
        link
    ) VALUES (?,?,?,?,?);        
    `
    
    const values = [
       req.body.image,
       req.body.title,
       req.body.category,
       req.body.description,
       req.body.link,
    ]

    db.run(query, values, function(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no banco de dados")
        }

         return res.redirect("/ideias")
    })
})

//liguei meu servidor na porta 3000
server.listen(3000)
