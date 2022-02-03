process.env.NODE_ENV = "test"

const app = require("../app")
const request = require("supertest");
const db = require("../db")

describe("All routes test", function() {
    beforeEach(async function() {
        await db.query("DELETE FROM books")
        await db.query(`INSERT INTO books (
            isbn,
            amazon_url,
            author,
            language,
            pages,
            publisher,
            title,
            year) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
         RETURNING isbn,
                   amazon_url,
                   author,
                   language,
                   pages,
                   publisher,
                   title,
                   year`,
      [
        "0691161518",
        "http://a.co/eobPtX2",
        "Matthew Lane",
        "english",
        264,
        "Princeton University Press",
        "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        2020
      ]
    );
    })

    describe("GET /", function() {
        test("get all books", async function() {
            let response = await request(app).get("/books")
            expect(response.statusCode).toEqual(200)
            expect(response.body.books[0].isbn).toEqual("0691161518")
        })
    })

    describe("GET /:id", function() {
        test("get one books", async function() {
            let response = await request(app).get("/books/0691161518")
            expect(response.statusCode).toEqual(200)
            expect(response.body.book.isbn).toEqual("0691161518")
        })
    })

    describe("POST /:", function() {
        test("post books", async function() {
            let response = await request(app).post("/books")
            .send({
                "isbn": "0691161519",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
              })
            expect(response.statusCode).toEqual(201)
            expect(response.body.book.isbn).toEqual("0691161519")
        })

        test("post book with wrong data", async function() {
            let response = await request(app).post("/books")
            .send({
                "isbn": "0691161519",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "english",
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
              })
            expect(response.statusCode).toEqual(400)
        })

    })

    describe("PUT /:ISBN", function() {
        test("UPDATE books", async function() {
            let response = await request(app).put("/books/0691161518")
            .send({
                "isbn": "0691161519",
                "amazon_url": "http://a.co/eobPtX2",
                "author": "Matthew Lane",
                "language": "malayalam",
                "pages": 264,
                "publisher": "Princeton University Press",
                "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
                "year": 2017
              })
            expect(response.statusCode).toEqual(200)
            expect(response.body.book.language).toEqual("malayalam")
        })

    })

    describe("DELETE /:ISBN", function() {
        test("UPDATE books", async function() {
            let response = await request(app).delete("/books/0691161518")
            expect(response.statusCode).toEqual(200)
            expect(response.body).toEqual({ message: "Book deleted" })
        })

    })

})

afterAll(async function () {
    await db.end();
  });