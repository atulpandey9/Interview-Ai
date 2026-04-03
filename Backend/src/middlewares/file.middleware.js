const multer=requie("multer")

const upload=multer({
    storage:multer.memoryStorage(),
    limits:{
        fileSize:3*1024*1024//3MB
    }
})

module.exports=upload