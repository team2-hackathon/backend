require("dotenv").config
const sql = require("mysql2")
const express = require("express")
const cors = reququire ('cors')
PORT = process.env.PORT || 8080

app.use(cors())

app.get('/', (req, res)=>{
    res.send('Hello World')
})

app.listen(PORT, ()=>{`Express is throwing a party on port Fiesta ${PORT}`})