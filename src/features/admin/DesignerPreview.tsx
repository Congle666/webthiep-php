/** Khung xem trước thiệp THẬT trong Admin Designer: bìa (cover) hoặc nội dung (body). */
import { CSSProperties } from 'react';
import { LAYOUTS } from '../invitation/layouts';
import { InvitationBody } from '../invitation/InvitationBody';
import { DecoConfig, decosByZone } from '../invitation/decorations';
import { sampleInvitation } from './sampleInvitation';
import { TRANSLATIONS } from '../invitation/i18n';

type Theme = Record<string, string>;
export type Zone = 'cover' | 'body';

interface Props {
  layout: string;
  theme: Theme;
  decos: DecoConfig[];
  zone: Zone;
  onChange: (list: DecoConfig[]) => void;   // nhận danh sách ĐẦY ĐỦ (cả 2 zone)
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

function themeVars(theme: Theme): CSSProperties {
  return {
    '--red': theme.red, '--red-deep': theme.redDeep, '--red-soft': theme.redSoft,
    '--text': theme.text, '--heading': theme.heading, '--muted': theme.muted,
    background: theme.paper ? `${theme.bg} url('${theme.paper}')` : theme.bg,
  } as CSSProperties;
}

export function DesignerPreview({ layout, theme, decos, zone, onChange, selectedId, onSelect }: Props) {
  const L = LAYOUTS[layout] ?? LAYOUTS.traditional;
  const inv = sampleInvitation(layout);
  const zoneDecos = decosByZone(decos, zone) ?? [];

  /** Ghép danh sách của zone hiện tại trở lại mảng đầy đủ (giữ nguyên zone kia). */
  const handleZoneChange = (next: DecoConfig[]) => {
    const others = decos.filter((d) => (d.zone ?? 'body') !== zone);
    onChange([...others, ...next.map((d) => ({ ...d, zone }))]);
  };

  if (zone === 'cover') {
    return (
      <div className="dsn-frame dsn-frame--cover" style={themeVars(theme)}>
        <L.Cover
          inv={inv}
          guestName="Nguyễn Văn A"
          onOpen={() => {}}
          inline
          editable
          decorations={zoneDecos}
          onDecoChange={handleZoneChange}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </div>
    );
  }

  return (
    <div className={`dsn-frame inv-root inv-${layout}`} style={themeVars(theme)}>
      <L.Header inv={inv} editMode decorations={zoneDecos} onDecoChange={handleZoneChange}
        selectedId={selectedId} onSelect={onSelect} />
      <InvitationBody inv={inv} slug="preview" t={TRANSLATIONS.vi} />
    </div>
  );
}
