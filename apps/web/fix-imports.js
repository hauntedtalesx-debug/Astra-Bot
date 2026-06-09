const fs = require('fs');
const path = require('path');
const dirs = ['agenda', 'clips', 'giveaways', 'integrations', 'missions', 'roles', 'shorts', 'sticky', 'welcome'];
const baseDir = path.join(process.cwd(), 'src/app/dashboard/[guildId]');

for (const dir of dirs) {
  const filePath = path.join(baseDir, dir, 'page.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/import \{ getServerSession \} from "next-auth";\r?\nimport \{ authOptions \} from "@\/app\/api\/auth\/\[\.\.\.nextauth\]\/route";/, 'import { auth } from "@/auth";');
    content = content.replace(/const session = await getServerSession\(authOptions\);/g, 'const session = await auth();');
    fs.writeFileSync(filePath, content);
    console.log('Fixed', filePath);
  }
}
