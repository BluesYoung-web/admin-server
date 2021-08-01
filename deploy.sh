echo '开始进行部署前必要的处理';

# 复制依赖描述文件，便于安装依赖
cp ./package.json ./dist;
cp ./yarn.lock ./dist;

# 创建静态文件上传时存放的目录
cd ./dist;
mkdir public && cd public && mkdir upload;

echo '处理结束，直接将 dist 目录部署至服务器即可';