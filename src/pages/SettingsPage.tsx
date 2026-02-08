import { Database, Moon, Sun, Monitor, Info, Hash, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLists } from '../hooks/useLists';
import './SettingsPage.css';

export const SettingsPage: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const { lists, deleteList } = useLists();

    const handleDeleteTag = async (id: number, name: string) => {
        if (confirm(`タグ「${name}」を削除しますか？\nこのタグが付いたタスクはインボックスへ移動します。`)) {
            await deleteList(id);
        }
    };

    return (
        <div className="page-content settings-page">
            <header className="page-header">
                <h1>設定</h1>
                <p className="subtitle">アプリケーションの設定と情報</p>
            </header>

            <div className="settings-section glass-panel">
                <div className="section-header">
                    <Monitor size={20} />
                    <h2>表示設定</h2>
                </div>
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>外観テーマ</h3>
                        <p>ライトモードとダークモードを切り替えます</p>
                    </div>
                    <button className="theme-toggle-btn" onClick={toggleTheme}>
                        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                        <span>{theme === 'dark' ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}</span>
                    </button>
                </div>
            </div>

            <div className="settings-section glass-panel">
                <div className="section-header">
                    <Hash size={20} />
                    <h2>タグ管理</h2>
                </div>
                <div className="setting-item tags-management">
                    {lists?.filter(l => l.id !== 1).length === 0 ? (
                        <p className="no-tags">登録されているタグはありません</p>
                    ) : (
                        <div className="settings-tags-list">
                            {lists?.filter(l => l.id !== 1).map(list => (
                                <div key={list.id} className="settings-tag-item">
                                    <div className="tag-name-group">
                                        <Hash size={14} style={{ color: list.color }} />
                                        <span>{list.name}</span>
                                    </div>
                                    <button
                                        className="tag-delete-btn"
                                        onClick={() => handleDeleteTag(list.id!, list.name)}
                                        aria-label="タグを削除"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="settings-section glass-panel">
                <div className="section-header">
                    <Database size={20} />
                    <h2>データ管理</h2>
                </div>
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>データの保存場所</h3>
                        <p>すべてのデータはブラウザのIndexedDBに保存されています（オフライン対応）</p>
                    </div>
                </div>
            </div>

            <div className="settings-section glass-panel">
                <div className="section-header">
                    <Info size={20} />
                    <h2>アプリについて</h2>
                </div>
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>バージョン</h3>
                        <p>v0.1.0 (Beta)</p>
                    </div>
                </div>
                <div className="setting-item">
                    <div className="setting-info">
                        <h3>開発状況</h3>
                        <p>現在開発中のため、機能は随時追加されます。</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
