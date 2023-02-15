import prisma from "../prisma";
import { Router } from "express";
import slugify from "slugify";
import { ukCounties } from "../ukCounties";
const testDataRouter = Router();
import { faker } from "@faker-js/faker";
import { Genre, County, User } from "@prisma/client";
import { randomUUID } from "crypto";

const genres: Genre[] = [
  "Rock",
  "Blues",
  "Jazz",
  "Indie",
  "Reggae",
  "Pop",
  "Electronic",
  "None",
  "Other",
];

async function saveAndCreatePost(county: County, user: User) {
  let title = faker.lorem.lines(1);
  title = title.substring(0, title.length - 1);

  return await prisma.post.create({
    data: {
      title,
      authorId: user.id,
      genre: genres[returnRandomNumber(genres.length)],
      content: faker.lorem.paragraphs(6, "\n"),
      countyId: county.name,
    },
  });
}

function generateUsers() {
  return Array.from({ length: 20 }, (e, i) => {
    return {
      id: randomUUID(),
      username: faker.internet.userName() + (`${i + 1}` + `${i - 1}`),
      passwordHash: faker.internet.password(),
    };
  });
}

function returnRandomNumber(number: number) {
  return Math.floor(Math.random() * number);
}

// testDataRouter.get("/", async (request, response) => {
//   try {
//     const testUsers = generateUsers();

//     await prisma.user.createMany({
//       data: testUsers,
//     });

//     const countiesWithSlug = ukCounties.map(el => ({
//       ...el,
//       slug: slugify(el.name),
//     }));

//     await prisma.county.createMany({
//       data: countiesWithSlug,
//     });

//     countiesWithSlug.forEach(async el => {
//       let i = 0;
//       const max = returnRandomNumber(30);
//       while (i < max) {
//         await saveAndCreatePost(
//           el,
//           testUsers[returnRandomNumber(testUsers.length)]
//         );
//         i++;
//       }
//     });

//     return response.status(200).json({ message: "Test data generated" });
//   } catch (err) {
//     console.error(err);
//     return response.status(400).json({ err, message: "Something went wrong" });
//   }
// });

export default testDataRouter;
