import request from "supertest";
import mongoose from "mongoose";
import {createServer} from "../build-server";
import {logger} from "../utils/logger";

const app = createServer()


/*
beforeEach((done) => {

	jest.setTimeout(90 * 1000)
mongoose.connect(
	"mongodb://localhost:27016/backend_prog_web",
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
	},
	() => {
		// tslint:disable-next-line:no-console
		logger.info("Connexion à MongoDB réussie !");
		mongoose.set("useNewUrlParser", true);
		mongoose.set("useFindAndModify", false);
		mongoose.set("useCreateIndex", true);
		done()
	}
)
})

afterEach((done) => {
mongoose.connection.db.dropDatabase(() => {
	jest.setTimeout(90 * 1000)
	mongoose.connection.close(() => {
		done()
	})
})
})
*/

jest.setTimeout(60 * 1000)

test("GET /station", async () => {
	/*const post = await Post.create({
		title: "Post 1",
		content: "Lorem ipsum",
	})*/

	await request(app)
		.get("/api/status")
		.expect(200)
		.then((response) => {
			// Check the response type and length
			//expect(Array.isArray(response.body)).toBeTruthy()
			/*expect(response.body.length).toEqual(1)

			// Check the response data
			expect(response.body[0]._id).toBe(post.id)
			expect(response.body[0].title).toBe(post.title)
			expect(response.body[0].content).toBe(post.content)*/
		})
})
