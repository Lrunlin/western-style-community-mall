const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");
const router = new Router();

router.get("/order", auth(), async ctx => {
  try {
    const { auth, id } = ctx;
    let query = `
      SELECT 
        o.*, 
        u.id AS user_id, 
        u.name AS user_name, 
        u.avatar AS user_avatar
      FROM 
        orders o
      LEFT JOIN 
        user u ON o.user_id = u.id
      WHERE`;

    if (auth === "user") {
      query += ` o.user_id = ${id}`;
    } else if (auth === "admin") {
      query += ` 1=1`; // 占位
    }

    if (ctx.query.id) {
      query += ` AND o.id = ${ctx.query.id}`;
    }

    query += ` ORDER BY o.create_time DESC`;

    const [result] = await db.query(query);

    for (let index = 0; index < result.length; index++) {
      const item = result[index];
      let [address] = await db.query(`select * from address where id=?`, [item.address_id]);
      result[index].address_data = address[0];
    }

    ctx.body = {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "订单查询失败",
      error: error.message,
    };
  }
});

module.exports = router;
