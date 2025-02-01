const Router = require("koa-router");
const db = require("@/db");
const id = require("@/utils/id");
const auth = require("@/modules/auth");

const router = new Router();

router.put("/address/:id", auth(), async ctx => {
  try {
    const { phone, address, name, isDefault } = ctx.request.body;

    if (!ctx.params.id || !phone || !address || !name || isDefault === undefined) {
      ctx.body = {
        success: false,
        message: "缺少必要的参数",
      };
      return;
    }

    // 更新旧地址的状态为 1
    await db.query("UPDATE address SET state = 0 WHERE id = ?", [ctx.params.id]);

    let _id = id();
    // 插入新的地址数据
    const result = await db.query(
      "INSERT INTO address (id, name, phone, address, isDefault,user_id) VALUES (?, ?, ?, ?, ?,?)",
      [_id, name, phone, address, isDefault, ctx.id]
    );

    ctx.body = {
      success: true,
      message: "地址修改成功",
      data: _id,
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "地址修改失败",
      error: error.message,
    };
  }
});

module.exports = router;
