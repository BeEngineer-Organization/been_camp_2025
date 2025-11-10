// ============================================
// Staff Authentication - Password Protection
// クライアントサイドハッシュ認証（GitHub Pages対応）
// ============================================

/**
 * パスワード認証機能
 * スタッフ専用ページへのアクセス制御
 * 
 * セキュリティ:
 * - パスワードはSHA-256でハッシュ化
 * - デベロッパーツールで見てもハッシュ値しか分からない
 * - 元のパスワードを推測することは困難
 * - GitHub Pagesで動作可能
 */
(function() {
    // パスワードのハッシュ値（SHA-256）
    // 変更方法: SETUP_HASH.md を参照
    const PASSWORD_HASH = 'ecdedc220579bfe6f6844928e6b4c50a87891f03a8f7d96ad05197c27ecf5eea';
    
    const passwordOverlay = document.getElementById('passwordOverlay');
    const mainContent = document.getElementById('mainContent');
    const passwordInput = document.getElementById('passwordInput');
    const passwordBtn = document.getElementById('passwordBtn');
    const passwordError = document.getElementById('passwordError');
    
    // セッションストレージでログイン状態を保持
    if (sessionStorage.getItem('staffLoggedIn') === 'true') {
        showMainContent();
    }
    
    // Enterキーでログイン
    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
    
    // ログインボタン
    passwordBtn.addEventListener('click', checkPassword);
    
    /**
     * SHA-256ハッシュ関数
     * 入力されたパスワードをハッシュ化
     */
    async function sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    
    /**
     * パスワードをチェック
     */
    async function checkPassword() {
        const inputValue = passwordInput.value;
        
        // 空のパスワードチェック
        if (!inputValue) {
            showError('パスワードを入力してください');
            return;
        }
        
        // ローディング状態
        passwordBtn.disabled = true;
        passwordBtn.textContent = '確認中...';
        
        try {
            // 入力されたパスワードをハッシュ化
            const inputHash = await sha256(inputValue);
            
            // ハッシュ値を比較
            if (inputHash === PASSWORD_HASH) {
                // 認証成功
                sessionStorage.setItem('staffLoggedIn', 'true');
                showMainContent();
            } else {
                // 認証失敗
                showError('パスワードが正しくありません');
            }
        } catch (error) {
            console.error('認証エラー:', error);
            showError('認証処理中にエラーが発生しました');
        } finally {
            // ローディング状態を解除
            passwordBtn.disabled = false;
            passwordBtn.textContent = 'ログイン';
        }
    }
    
    /**
     * エラーメッセージを表示
     */
    function showError(message) {
        passwordError.textContent = message;
        passwordError.classList.add('show');
        passwordInput.value = '';
        passwordInput.focus();
        
        // エラーメッセージを3秒後に非表示
        setTimeout(() => {
            passwordError.classList.remove('show');
        }, 3000);
    }
    
    /**
     * メインコンテンツを表示
     */
    function showMainContent() {
        passwordOverlay.style.display = 'none';
        mainContent.classList.remove('content-hidden');
    }
})();

// ============================================
// 持ち物リストの開閉機能
// ============================================

/**
 * 持ち物リストのトグル機能を初期化
 */
function initStaffItemsToggle() {
    const itemsSection = document.querySelector('[data-staff-items]');
    
    if (!itemsSection) return;
    
    const header = itemsSection.querySelector('.staff-items-header');
    const content = itemsSection.querySelector('.staff-items-content');
    const toggleIcon = itemsSection.querySelector('.staff-items-toggle');
    
    if (!header || !content || !toggleIcon) return;
    
    // ヘッダーをクリックで開閉
    header.addEventListener('click', function() {
        const isOpen = itemsSection.classList.contains('active');
        
        if (isOpen) {
            // 閉じる
            itemsSection.classList.remove('active');
            content.style.maxHeight = '0';
            toggleIcon.style.transform = 'rotate(0deg)';
        } else {
            // 開く
            itemsSection.classList.add('active');
            content.style.maxHeight = content.scrollHeight + 'px';
            toggleIcon.style.transform = 'rotate(180deg)';
        }
    });
}

// ============================================
// スケジュールタブ切り替え機能
// ============================================

/**
 * スケジュールタブの切り替え機能を初期化
 */
function initScheduleTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length === 0 || tabContents.length === 0) return;
    
    // 初期状態でアクティブなタブの絵文字を🍁に変更
    const initialActiveTab = document.querySelector('.tab-btn.active');
    if (initialActiveTab) {
        updateTabEmoji(initialActiveTab, true);
    }
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // すべてのタブボタンの絵文字を📅に戻す
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                updateTabEmoji(btn, false);
            });
            tabContents.forEach(content => content.classList.remove('active'));
            
            // クリックされたタブボタンとそのコンテンツにactiveクラスを追加
            this.classList.add('active');
            updateTabEmoji(this, true);
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

/**
 * タブボタンの絵文字を更新
 * @param {HTMLElement} button - タブボタン要素
 * @param {boolean} isActive - アクティブ状態かどうか
 */
function updateTabEmoji(button, isActive) {
    const emojiSpan = button.querySelector('.tab-emoji');
    if (emojiSpan) {
        emojiSpan.textContent = isActive ? '🍁' : '📅';
    }
}

// ページ読み込み時に初期化
document.addEventListener('DOMContentLoaded', function() {
    initStaffItemsToggle();
    initScheduleTabs();
});

