const Router = require("koa-router");
const db = require("@/db");
const auth = require("@/modules/auth");

const router = new Router();

router.delete("/address/:id", auth(), async ctx => {
  try {
    const { id } = ctx.params;

    if (!id) {
      ctx.body = {
        success: false,
        message: "缺少必要的参数",
      };
      return;
    }

    // 更新地址状态为 0，表示已删除
    await db.query("UPDATE address SET state = 0 WHERE id = ? and user_id=?", [id, ctx.id]);

    ctx.body = {
      success: true,
      message: "地址删除成功",
    };
  } catch (error) {
    console.error(error);
    ctx.body = {
      success: false,
      message: "地址删除失败",
    };
  }
});

module.exports = router;
