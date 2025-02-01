const Router = require("koa-router");
const db = require("@/db");
const router = new Router();
const auth = require("@/modules/auth");
const qs = require("qs");

router.get("/cart", auth(), async ctx => {
  const id = qs.parse(ctx.request.query)?.id; //数组

  try {
    const userId = ctx.id;
    let query = `SELECT 
        c.id AS cart_id,
        c.count,
        cm.id AS commodity_id,
        cm.name AS commodity_name,
        cm.cover AS commodity_cover,
        cm.inventory AS commodity_inventory,
        cm.price AS commodity_price,
        cm.description AS commodity_description
      FROM 
        cart c
      INNER JOIN
        commodity cm ON c.commodity_id = cm.id
      WHERE
        c.user_id = ?`;

    const params = [userId];
    if (id && Array.isArray(id) && id.length > 0) {
      query += ` AND c.id IN (?)`;
      params.push(id);
    }

    query += " ORDER BY c.id DESC";

    const [result] = await db.query(query, params);

    ctx.body = {
      success: true,
      data: result,
    };
  } catch (error) {
    ctx.body = {
      success: false,
      message: "查询错误",
      error: error.message,
    };
  }
});

module.exports = router;
