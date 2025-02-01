const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();
const id = require("@/utils/id");

router.post("/commodity", auth(), async ctx => {
  try {
    const { name, description, cover, banner, price, inventory, configuration } = ctx.request.body;

    const result = await db.query(
      `INSERT INTO commodity (id, name, description, cover, banner, price, create_time, state, inventory, configuration) 
       VALUES (?, ?, ?, ?, ?, ?, NOW(), 1, ?, ?)`,
      [
        id(),
        name,
        description,
        cover,
        JSON.stringify(banner),
        price,
        inventory,
        JSON.stringify(configuration),
      ]
    );

    ctx.body = {
      success: !!result[0]?.affectedRows,
      message: "添加成功",
    };
  } catch (error) {
    console.error("Error adding commodity:", error);
    ctx.body = {
      success: false,
      error: error.message,
      message: "添加失败",
    };
  }
});

module.exports = router;
