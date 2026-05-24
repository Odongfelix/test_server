import e from 'express'

const server = e()

server.listen(3000,'0.0.0.0',(e)=>{
    if(e) throw e
    console.log('Server is running on port 3000')
})

server.get('/',(req,res)=>{
    res.send('Hello getter.')
})