const { nanoid } = require('nanoid');
const notes = require('./notes.js')


// Membuat handler untuk menyimpan catatan
const addNoteHandler = (request, h) => {
    const {title, tags, body} = request.payload; // Mendapatkan body request yang dikirimkan client

    // Membuat id unik dengan nanoid. install nanoid versi 3 agar dapat berjalan menggunakan common js module
    const id = nanoid(8); // Argument pada method nanoid berupa number yang menunjukan panjang dari id
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    // Menampung data yang telah dibuat kedalam objek
    const newNote = {
        title, tags, body, id, createdAt, updatedAt
    }

    //Memasukan data newNote kedalam objek notes. jangan lupa mengimpor module notes
    notes.push(newNote)

    // Mengecek apakah newNote telah masuk kedalam array notes
    const isSuccess = notes.filter((node) => node.id === id).length > 0;

    // Memberikan response kepada client
    if (isSuccess) {
        return h.response({
            status: "Success",
            message: "Catatan berhasil ditambahkan",
            data: {
                noteId: id,
            }
        }).code(201);
    }

    return h.response({
        status: "fail",
        message: "Catatan gagal ditambahkan",
    }).code(500);
}


// Membuat handler ujntuk menampilkan catatan
const getAllNotesHandler = () => ({
    status: "success",
    data: {
        notes,
    },
})


// Menampilkan catatan sesuai id
const getNoteByIdHandler = (req, h) => {
    const { id } = req.params;

    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status: "success",
            data: {
                note,
            },
        };
    } 

    return h.response({
        status: "fail",
        message: "Catatan tidak ditemukan",
    }).code(404);
}



const editNoteByIdHandler = (req, h) => {
    const { id } = req.params;

    const { title, tags, body } = req.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        }

        return h.response({
            status: "success",
            message: "Data berhasil diubah"
        }).code(200);
    }

    return h.response({
        status: "fail",
        message: "Gagal memperbarui catatan. Id tidak ditemukan"
    }).code(404)
}


const deleteNoteByIdHandler = (req, h) => {
    const {id} = req.params;

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1)

        return h.response({
            status: "success",
            message: "catatan berhasil dihapus",
        }).code(200)
    }

    return h.response({
        status: "fail",
        message: "catatan tidak ditemukan",
    }).code(404);
}




module.exports = {
    addNoteHandler, 
    getAllNotesHandler, 
    getNoteByIdHandler,
    editNoteByIdHandler,
    deleteNoteByIdHandler,
}