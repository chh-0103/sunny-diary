import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '@/contexts/ProfileContext';
import { AVAILABLE_TAGS } from '@/types';
import type { ProfileTag } from '@/types';
import BottomNav from '@/components/BottomNav';
import DatePicker from '@/components/DatePicker';
import LocationPicker from '@/components/LocationPicker';
import { Cake, MapPin, Tag, Camera, Settings, UserRound } from 'lucide-react';

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getAge(iso: string): number | null {
  if (!iso) return null;
  const birth = new Date(iso);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age > 0 ? age : null;
}

function compressImage(file: File, maxSize: number): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;
        if (w > h) { if (w > maxSize) { h = h * maxSize / w; w = maxSize; } }
        else { if (h > maxSize) { w = w * maxSize / h; h = maxSize; } }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const { profile, loading, loadProfile, updateProfile } = useProfile();
  const [editing, setEditing] = useState(false);
  const [gender, setGender] = useState('');
  const [birthday, setBirthday] = useState('');
  const [birthplace, setBirthplace] = useState('');
  const [tags, setTags] = useState<ProfileTag[]>([]);
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef(gender);
  const birthdayRef = useRef(birthday);
  const birthplaceRef = useRef(birthplace);
  const tagsRef = useRef(tags);
  const avatarRef = useRef(avatar);
  genderRef.current = gender;
  birthdayRef.current = birthday;
  birthplaceRef.current = birthplace;
  tagsRef.current = tags;
  avatarRef.current = avatar;

  useEffect(() => { loadProfile(); }, [loadProfile]);

  useEffect(() => {
    if (profile) {
      setGender(profile.gender);
      setBirthday(profile.birthday);
      setBirthplace(profile.birthplace);
      setTags(profile.tags || []);
      setAvatar(profile.avatar_url || '');
    }
  }, [profile]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    const updates = { gender: genderRef.current, birthday: birthdayRef.current, birthplace: birthplaceRef.current, tags: tagsRef.current, avatar_url: avatarRef.current };
    await updateProfile(updates);
    setSaving(false);
    setEditing(false);
  }, [updateProfile]);

  const handleTagToggle = (tag: ProfileTag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await compressImage(file, 300);
    setAvatar(base64);
  };

  return (
    <div className="page-container pb-28">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-text-muted">加载中...</div>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto">
          <div className="card min-h-[calc(100vh-9rem)] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-handwriting text-3xl text-warmbrown">个人资料</h2>
              <div className="flex items-center gap-2">
                {!editing ? (
                  <button onClick={() => setEditing(true)} className="btn-ghost text-sm py-1.5 px-4">
                    编辑
                  </button>
                ) : (
                  <>
                    <button onClick={() => setEditing(false)} className="btn-ghost text-sm py-1.5 px-4">取消</button>
                    <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-1.5 px-4">
                      {saving ? '保存中' : '保存'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-6 flex-1">
              <div className="flex items-center gap-4">
                <div
                  onClick={handleAvatarClick}
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shrink-0 overflow-hidden
                    ${avatar ? '' : 'bg-apricot/40'}
                    cursor-pointer hover:opacity-80 transition-all relative group`}
                  title="点击更换头像"
                >
                  {avatar ? (
                    <img src={avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span>{gender === '女' ? '\u{1F467}' : gender === '男' ? '\u{1F466}' : '\u{1F464}'}</span>
                  )}
                  {editing && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={16} className="text-white" />
                    </div>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarFile} className="hidden" />
              </div>

              <div className="flex items-center gap-4">
                <UserRound size={22} className="text-warmbrown shrink-0" />
                {editing ? (
                  <div className="flex gap-2">
                    {(['男', '女', '保密'] as const).map(g => (
                      <button key={g} onClick={() => setGender(g)}
                        className={`px-4 py-1.5 rounded-full text-sm transition-all
                          ${gender === g ? 'bg-coral text-white' : 'bg-apricot/30 text-text-soft'}`}>
                        {g}
                      </button>
                    ))}
                  </div>
                ) : (
                  <span className="text-text-soft font-medium">{profile?.gender || '未设置'}</span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <Cake size={22} className="text-warmbrown shrink-0" />
                {editing ? (
                  <DatePicker value={birthday} onChange={setBirthday} />
                ) : (
                  <span className="text-text-soft">
                    {birthday ? formatDate(birthday) : '未设置'}
                    {birthday && getAge(birthday) && (
                      <span className="text-coral text-xs ml-1.5 bg-coral/10 px-1.5 py-0.5 rounded-full">
                        {getAge(birthday)}岁
                      </span>
                    )}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <MapPin size={22} className="text-warmbrown shrink-0" />
                {editing ? (
                  <LocationPicker value={birthplace} onChange={setBirthplace} />
                ) : (
                  <span className="text-text-soft">
                    {birthplace || '未设置'}
                    {birthplace && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-coral/60 ml-2 animate-pulse align-middle" />
                    )}
                  </span>
                )}
              </div>

              <div className="flex items-start gap-4">
                <Tag size={22} className="text-warmbrown shrink-0 mt-0.5" />
                {editing ? (
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_TAGS.map(tag => (
                      <button key={tag} onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1 rounded-full text-xs transition-all
                          ${tags.includes(tag) ? 'bg-coral text-white' : 'bg-apricot/30 text-text-soft'}`}>
                        {tag}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {tags.length > 0 ? tags.map(tag => (
                      <span key={tag} className="px-2.5 py-0.5 rounded-full bg-apricot/30 text-xs text-warmbrown">
                        {tag}
                      </span>
                    )) : (
                      <span className="text-text-soft">未设置</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-auto pt-6 border-t border-apricot/30">
              <button
                onClick={() => navigate('/settings')}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl
                           bg-apricot/20 hover:bg-apricot/30 text-warmbrown font-medium
                           transition-all active:scale-[0.98]"
              >
                <Settings size={18} />
                设置
              </button>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}