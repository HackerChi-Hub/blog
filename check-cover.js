const notion = require('./lib/notion');

async function checkPostCover() {
  try {
    const posts = await notion.getPosts();
    const m5Post = posts.find(p => p.title.includes('M5 Pro'));
    
    if (m5Post) {
      console.log('M5 Pro文章封面状态:');
      console.log('标题:', m5Post.title);
      console.log('是否有pageCover:', !!m5Post.pageCover);
      console.log('pageCover URL:', m5Post.pageCover || '无页面封面');
      console.log('文章ID:', m5Post.id);
      console.log('完整数据:', JSON.stringify(m5Post, null, 2));
    } else {
      console.log('未找到M5 Pro文章');
    }
  } catch (error) {
    console.error('检查失败:', error.message);
  }
}

checkPostCover();
