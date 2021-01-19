const axios = require('axios')

function insertMany(collection,arr) {
    return new Promise((resolve,reject) => {
        const MongoClient = require('mongodb').MongoClient
        const url = 'mongodb://localhost: 27017'
        MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true,},(err,db) => {
            if(err) throw err
            const dbo = db.db('node_spider')
            dbo.collection(collection).insertMany(arr,(err,res) => {
                if(err) reject(err)
                console.log('插入的文档数量：'+res.insertedCount)
                db.close()
                resolve()
            })
        })
    })
}

function insertOne(collection,arr) {
    return new Promise((resolve,reject) => {
        const MongoClient = require('mongodb').MongoClient
        const url = 'mongodb://localhost: 27017'
        MongoClient.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true,},(err,db) => {
            if(err) throw err
            const dbo = db.db('node_spider')
            dbo.collection(collection).insertOne(arr,(err,res) => {
                if(err) reject(err)
                console.log('文档插入成功')
                db.close()
                resolve()
            })
        })
    })
}

async function getHeroList() {
    const url = 'https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js'
    const result = await axios.get(url)
    console.log('result',result)
    await insertMany('herolist',result.data.hero)
    return result.data.hero
}

// getHeroList()

async function getHero(heroid) {
    const url = `https://ossweb-img.qq.com/images/lol/act/img/js/hero/${heroid}.js`
    const result = await axios.get(url)
    await insertOne('heroinfo',result.data.hero)
    return result.data
}

async function run() {
    const heroList = await getHeroList() 
    await heroList.reduce(async (prev,item,i) => {
        await prev 
        return new Promise(async(resolve,reject) => {
            await getHero(item.heroId)
            resolve()
        })
    },Promise.resolve())
}

run()