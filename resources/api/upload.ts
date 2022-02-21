import fs from 'fs'
import path from 'path'

export default async function async({ request, response }) {

    const data = request.only(['file', 'signature', 'key'])
    if (typeof data.signature === "undefined" || typeof data.key === "undefined") return response.status(200).json({ status: false, message: "Invalid Keys" })

    if(data.signature.length < 3) return response.status(200).json({ status: false, message: "Invalid Signature length" })
  
    const file = request.file('file')
    const randomFileName = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    const fileName = randomFileName + path.extname(file.clientName)
    const filePath = path.join(__dirname, '../../public/uploads/')
    
    await file.move(filePath, {
        name: fileName,
        overwrite: true
    })

    const fileContent = fs.readFileSync(filePath + fileName)
    const signature = fileContent.toString().indexOf(data.signature)
    if(signature === -1){
        fs.unlinkSync(filePath + fileName)
        return response.status(200).json({ status: false, message: "Invalid Signature" })
    } 
  

    // move file to public/uploads
    //await file.move(filePath)

    response.status(200).json({ status: true })
}