import mongoose from "mongoose";
import {createServer} from "../src/app/build-server";
import {logger} from "../src/app/utils/logger";
import * as request from "supertest";

let conn_string = ""

if (process.env.DB_CONN_STRING) {
	conn_string = process.env.DB_CONN_STRING;
}else{
	console.log("No db connection string found!")
	process.exit()
}

//beforeEach((done) => {
	mongoose.connect(
		"mongodb://localhost:27017/acmedb",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true
		},
		() => {
			//done()
			// tslint:disable-next-line:no-console
			logger.info("Connexion à MongoDB réussie !");
			mongoose.set("useNewUrlParser", true);
			mongoose.set("useFindAndModify", false);
			mongoose.set("useCreateIndex", true);
		}
	)/*.then(()=>{

	})*/
//})

//afterEach((done) => {
	mongoose.connection.db.dropDatabase(() => {
		mongoose.connection.close(() => {/*done()*/
		})
	})
//})

const app = createServer()


test("GET /posts", async () => {
	/*const post = await Post.create({
		title: "Post 1",
		content: "Lorem ipsum",
	})*/

	await supertest(app)
		.get("/api/posts")
		.expect(200)
		.then((response) => {
			// Check the response type and length
			/*expect(Array.isArray(response.body)).toBeTruthy()
			expect(response.body.length).toEqual(1)

			// Check the response data
			expect(response.body[0]._id).toBe(post.id)
			expect(response.body[0].title).toBe(post.title)
			expect(response.body[0].content).toBe(post.content)*/
		})
})
