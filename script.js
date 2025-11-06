// ============================================
// BeEngineer Programming Camp - Main Script
// ============================================

/**
 * DOMContentLoaded イベント
 * ページ読み込み完了後に実行
 */
document.addEventListener('DOMContentLoaded', function() {
  
  // 持ち物チェックリスト機能を初期化
  initChecklistFeature();
  
  // スムーススクロール機能を初期化
  initSmoothScroll();
  
});

/**
 * 持ち物チェックリスト機能
 * localStorageでチェック状態を保存・復元
 */
function initChecklistFeature() {
  const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  
  if (checklistItems.length === 0) {
    // チェックリストが存在しない場合は処理をスキップ
    return;
  }
  
  // ページ読み込み時に保存された状態を復元
  checklistItems.forEach(item => {
    const itemKey = item.getAttribute('data-item');
    const savedState = localStorage.getItem(itemKey);
    
    if (savedState === 'true') {
      item.checked = true;
      item.parentElement.classList.add('checked');
    }
  });
  
  // チェック状態の変更を監視
  checklistItems.forEach(item => {
    item.addEventListener('change', function() {
      const itemKey = this.getAttribute('data-item');
      localStorage.setItem(itemKey, this.checked);
      
      if (this.checked) {
        this.parentElement.classList.add('checked');
      } else {
        this.parentElement.classList.remove('checked');
      }
    });
  });
}

/**
 * スムーススクロール機能
 * ページ内リンクをクリックした際に滑らかにスクロール
 */
function initSmoothScroll() {
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // '#' のみ、または空の場合はスキップ
      if (href === '#' || href === '') {
        return;
      }
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // URLを更新（履歴に追加）
        if (history.pushState) {
          history.pushState(null, null, href);
        }
      }
    });
  });
}

/**
 * チェックリストをリセット（デバッグ用）
 * 必要に応じてコンソールから実行: resetChecklist()
 */
function resetChecklist() {
  const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  
  checklistItems.forEach(item => {
    const itemKey = item.getAttribute('data-item');
    localStorage.removeItem(itemKey);
    item.checked = false;
    item.parentElement.classList.remove('checked');
  });
  
  console.log('チェックリストがリセットされました');
}

