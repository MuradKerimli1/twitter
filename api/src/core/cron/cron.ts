import cron from "node-cron";
import { User } from "../../dal/entity/user.entity";

export const startViewerCleanupJob = () => {
  cron.schedule("0 0 1 * *", async () => {
    try {
      const users = await User.find({ relations: ["viewers"] });

      for (const user of users) {
        if (user.viewers.length > 0) {
          user.viewers = [];
          await user.save();
        }
      }

      console.log("Bütün user-lər üçün viewers sıfırlandı.");
    } catch (err) {
      console.error("Viewer cleanup zamanı xəta baş verdi:", err);
    }
  });
};
