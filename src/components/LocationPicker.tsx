import { useState, useMemo } from 'react';
import { MapPin } from 'lucide-react';

const PLANETS = ['水星', '金星', '地球', '火星', '木星', '土星', '天王星', '海王星'];

const ALL_CONTINENTS = ['亚洲', '欧洲', '非洲', '北美洲', '南美洲', '大洋洲'];

const COUNTRIES: Record<string, string[]> = {
  '亚洲': ['中国', '日本', '韩国', '印度', '泰国', '新加坡', '马来西亚', '越南', '菲律宾', '印度尼西亚', '阿联酋', '沙特阿拉伯'],
  '欧洲': ['英国', '法国', '德国', '意大利', '西班牙', '荷兰', '瑞士', '瑞典', '挪威', '俄罗斯', '葡萄牙', '希腊'],
  '非洲': ['埃及', '南非', '肯尼亚', '尼日利亚', '摩洛哥', '埃塞俄比亚'],
  '北美洲': ['美国', '加拿大', '墨西哥', '古巴'],
  '南美洲': ['巴西', '阿根廷', '智利', '哥伦比亚', '秘鲁'],
  '大洋洲': ['澳大利亚', '新西兰', '斐济'],
};

const CITIES: Record<string, string[]> = {
  '中国': ['北京', '上海', '广州', '深圳', '成都', '杭州', '武汉', '重庆', '南京', '西安', '厦门', '青岛', '大连', '长沙', '苏州'],
  '日本': ['东京', '大阪', '京都', '札幌', '名古屋', '福冈', '横滨'],
  '韩国': ['首尔', '釜山', '仁川', '大邱', '济州'],
  '印度': ['新德里', '孟买', '班加罗尔', '加尔各答', '金奈'],
  '泰国': ['曼谷', '清迈', '普吉', '芭提雅'],
  '新加坡': ['新加坡'],
  '马来西亚': ['吉隆坡', '槟城', '马六甲'],
  '越南': ['河内', '胡志明市', '岘港'],
  '菲律宾': ['马尼拉', '宿务'],
  '印度尼西亚': ['雅加达', '巴厘岛'],
  '阿联酋': ['迪拜', '阿布扎比'],
  '沙特阿拉伯': ['利雅得', '吉达'],
  '英国': ['伦敦', '曼彻斯特', '爱丁堡', '利物浦', '伯明翰'],
  '法国': ['巴黎', '里昂', '马赛', '尼斯', '波尔多'],
  '德国': ['柏林', '慕尼黑', '汉堡', '法兰克福', '科隆'],
  '意大利': ['罗马', '米兰', '威尼斯', '佛罗伦萨', '那不勒斯'],
  '西班牙': ['马德里', '巴塞罗那', '塞维利亚', '瓦伦西亚'],
  '荷兰': ['阿姆斯特丹', '鹿特丹', '海牙'],
  '瑞士': ['苏黎世', '日内瓦', '伯尔尼'],
  '瑞典': ['斯德哥尔摩', '哥德堡'],
  '挪威': ['奥斯陆', '卑尔根'],
  '俄罗斯': ['莫斯科', '圣彼得堡', '喀山'],
  '葡萄牙': ['里斯本', '波尔图'],
  '希腊': ['雅典', '圣托里尼'],
  '埃及': ['开罗', '亚历山大', '卢克索'],
  '南非': ['开普敦', '约翰内斯堡', '德班'],
  '肯尼亚': ['内罗毕', '蒙巴萨'],
  '尼日利亚': ['拉各斯', '阿布贾'],
  '摩洛哥': ['卡萨布兰卡', '马拉喀什'],
  '埃塞俄比亚': ['亚的斯亚贝巴'],
  '美国': ['纽约', '洛杉矶', '旧金山', '芝加哥', '西雅图', '波士顿', '华盛顿', '迈阿密', '拉斯维加斯'],
  '加拿大': ['多伦多', '温哥华', '蒙特利尔', '渥太华', '卡尔加里'],
  '墨西哥': ['墨西哥城', '坎昆'],
  '古巴': ['哈瓦那'],
  '巴西': ['巴西利亚', '圣保罗', '里约热内卢'],
  '阿根廷': ['布宜诺斯艾利斯', '门多萨'],
  '智利': ['圣地亚哥'],
  '哥伦比亚': ['波哥大', '麦德林'],
  '秘鲁': ['利马', '库斯科'],
  '澳大利亚': ['悉尼', '墨尔本', '布里斯班', '珀斯', '阿德莱德'],
  '新西兰': ['奥克兰', '惠灵顿', '基督城'],
  '斐济': ['苏瓦'],
};

const COUNTRY_TO_CONTINENT: Record<string, string> = {};
for (const [continent, countries] of Object.entries(COUNTRIES)) {
  for (const country of countries) {
    COUNTRY_TO_CONTINENT[country] = continent;
  }
}

const CITY_TO_COUNTRY: Record<string, string> = {};
for (const [country, cities] of Object.entries(CITIES)) {
  for (const city of cities) {
    CITY_TO_COUNTRY[city] = country;
  }
}

interface LocationPickerProps {
  value: string;
  onChange: (value: string) => void;
}

function parseLocation(raw: string): { planet: string; continent: string; country: string; city: string } {
  if (!raw) return { planet: '', continent: '', country: '', city: '' };
  const parts = raw.split('/');
  return {
    planet: parts[0] || '',
    continent: parts[1] || '',
    country: parts[2] || '',
    city: parts[3] || raw,
  };
}

const selectClass = 'rounded-xl border border-apricot/50 bg-white/80 px-2 py-2 text-sm text-text-soft focus:outline-none focus:border-warmbrown/50 transition-all appearance-none cursor-pointer';

export default function LocationPicker({ value, onChange }: LocationPickerProps) {
  const parsed = parseLocation(value);
  const [planet, setPlanet] = useState(parsed.planet || '');
  const [continent, setContinent] = useState(parsed.continent);
  const [country, setCountry] = useState(parsed.country);
  const [city, setCity] = useState(parsed.city);

  const handlePlanet = (v: string) => {
    setPlanet(v);
    setContinent('');
    setCountry('');
    setCity('');
    if (v && v !== '地球') {
      onChange(v);
    } else if (!v) {
      onChange('');
    }
  };

  const handleContinent = (v: string) => {
    setContinent(v);
    setCountry('');
    setCity('');
    if (v) {
      setPlanet('地球');
      onChange(v);
    }
  };

  const handleCountry = (v: string) => {
    setCountry(v);
    setCity('');
    if (v) {
      const c = COUNTRY_TO_CONTINENT[v];
      setContinent(c || '');
      setPlanet('地球');
      onChange(v);
    }
  };

  const handleCity = (v: string) => {
    setCity(v);
    if (v) {
      const c = CITY_TO_COUNTRY[v];
      setCountry(c || '');
      setContinent(COUNTRY_TO_CONTINENT[c] || '');
      setPlanet('地球');
      onChange(v);
    }
  };

  const allCountries = useMemo(() => {
    return Object.keys(COUNTRY_TO_CONTINENT);
  }, []);

  const allCities = useMemo(() => {
    return Object.keys(CITY_TO_COUNTRY);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5 flex-wrap">
        <select value={planet} onChange={e => handlePlanet(e.target.value)} className={selectClass}>
          <option value="">星球</option>
          {PLANETS.map(p => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>

        <select value={continent} onChange={e => handleContinent(e.target.value)} className={selectClass}>
          <option value="">大洲</option>
          {ALL_CONTINENTS.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={country} onChange={e => handleCountry(e.target.value)} className={selectClass}>
          <option value="">国家</option>
          {allCountries.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={city} onChange={e => handleCity(e.target.value)} className={selectClass}>
          <option value="">城市</option>
          {allCities.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1 text-text-muted text-xs">
        <MapPin size={12} />
        <span>{[planet, continent, country, city].filter(Boolean).join(' / ')}</span>
      </div>
    </div>
  );
}