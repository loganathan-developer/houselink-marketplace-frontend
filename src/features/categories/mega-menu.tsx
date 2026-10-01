"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, ChevronRight, X } from "lucide-react";
import type { NavItem } from "@/data/home.mock";
import { categoryHref, type CategoryNode } from "./category-api";

const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

export function findRootCategory(navItem: NavItem, roots: CategoryNode[]) {
  const target = normalize(navItem.label);
  return roots.find((root) => normalize(root.name) === target || normalize(root.slug) === target);
}

const isSpecialItem = (item: NavItem) => ["newarrivals", "sale"].includes(normalize(item.label));
const specialDepartmentHref = (href: string, slug: string) => `${href}${href.includes("?") ? "&" : "?"}department=${encodeURIComponent(slug)}`;

function packSections(sections: CategoryNode[], columnCount: number) {
  const columns = Array.from({ length: columnCount }, () => [] as CategoryNode[]);
  const columnWeights = Array.from({ length: columnCount }, () => 0);
  const groups = sections.flatMap((section) => {
    if (section.children.length <= 8) return [section];
    return Array.from({ length: Math.ceil(section.children.length / 8) }, (_, index) => ({
      ...section,
      id: `${section.id}:${index}`,
      children: section.children.slice(index * 8, (index + 1) * 8),
    }));
  });
  groups.sort((a, b) => b.children.length - a.children.length);
  for (const section of groups) {
    const target = columnWeights.indexOf(Math.min(...columnWeights));
    columns[target].push(section);
    columnWeights[target] += Math.max(2, section.children.length + 1);
  }
  return columns;
}

export function MegaMenuColumn({ section, onNavigate }: { section: CategoryNode; onNavigate?: () => void }) {
  return (
    <div>
      <div>
        {section.children.length ? <p className="text-sm font-semibold leading-5 text-neutral-950">{section.name}</p> : <Link onClick={onNavigate} href={categoryHref(section.slug)} className="text-sm font-semibold leading-5 text-neutral-950 hover:text-[#137a70]">{section.name}</Link>}
      </div>
      {section.children.length ? (
        <div className="mt-1.5 grid">
          {section.children.map((child) => (
            <Link onClick={onNavigate} key={child.id} href={categoryHref(child.slug)} className="group/link flex items-center justify-between gap-2 py-[1.5px] text-sm leading-5 text-neutral-600 hover:text-[#137a70]">
              <span>{child.name}</span><ArrowUpRight className="h-3 w-3 shrink-0 opacity-0 transition-opacity group-hover/link:opacity-100" />
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function DesktopMegaMenu({ navItems, roots }: { navItems: NavItem[]; roots: CategoryNode[] }) {
  const [activeRootId, setActiveRootId] = useState<string | null>(null);

  return (
    <nav onMouseLeave={() => setActiveRootId(null)} className="hidden h-full items-stretch gap-5 text-[13px] font-normal uppercase text-neutral-900 xl:flex">
      {activeRootId ? <button type="button" aria-label="Close category menu" onClick={() => setActiveRootId(null)} onMouseEnter={() => setActiveRootId(null)} className="absolute inset-x-0 top-16 z-40 h-[calc(100dvh-4rem)] bg-black/25" /> : null}
      {navItems.map((item) => {
        const root = findRootCategory(item, roots);
        if (!root && !isSpecialItem(item)) return null;
        const itemKey = root?.id ?? `special:${normalize(item.label)}`;
        const isActive = itemKey === activeRootId;
        const sectionColumns = root ? packSections(root.children, 5) : [];

        return (
          <div key={itemKey} onMouseEnter={() => setActiveRootId(itemKey)} className="flex items-center">
            {root ? (
              <button type="button" onFocus={() => setActiveRootId(itemKey)} onClick={() => setActiveRootId(itemKey)} aria-expanded={isActive} className={`flex h-full items-center border-b-2 pt-0.5 uppercase ${isActive ? "border-neutral-950" : "border-transparent hover:border-neutral-950"}`}>
                {root.name}
              </button>
            ) : (
              <Link onFocus={() => setActiveRootId(itemKey)} href={item.href} className={`flex h-full items-center border-b-2 pt-0.5 ${isActive ? "border-[#137a70]" : "border-transparent"} ${item.featured ? "text-[#d64b35] hover:border-[#d64b35]" : "hover:border-neutral-950"}`}>{item.label}</Link>
            )}
            {root?.children.length && isActive ? (
              <div className="absolute left-1/2 top-16 z-50 max-h-[calc(100vh-5.5rem)] w-[min(1160px,calc(100vw-4rem))] -translate-x-1/2 overflow-y-auto bg-[#f7f8f5] normal-case shadow-[0_18px_45px_rgba(15,23,20,0.14)]">
                <div className="grid grid-cols-5 items-start gap-8 px-10 py-5">
                  {sectionColumns.map((sections, columnIndex) => (
                    <div key={columnIndex} className="flex flex-col gap-5">
                      {sections.map((section) => <MegaMenuColumn key={section.id} section={section} onNavigate={() => setActiveRootId(null)} />)}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {!root && isActive ? (
              <div className="absolute left-1/2 top-16 z-50 w-[min(820px,calc(100vw-3rem))] -translate-x-1/2 border border-neutral-300 bg-[#f3f5f0] p-7 normal-case shadow-[0_18px_45px_rgba(15,23,20,0.16)]">
                <div className="mb-6 flex items-end justify-between border-b border-neutral-300 pb-4">
                  <div><p className="text-[10px] font-semibold uppercase text-[#137a70]">Freshly selected</p><p className="mt-1 text-xl font-semibold">Explore {item.label}</p></div>
                  <p className="text-xs text-neutral-500">Choose your edit</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {roots.filter((department) => ["men", "women", "kids", "beauty", "footwear", "accessories"].includes(department.slug)).map((department) => (
                    <Link key={department.id} onClick={() => setActiveRootId(null)} href={specialDepartmentHref(item.href, department.slug)} className="flex items-center justify-between border border-neutral-300 bg-white px-4 py-3 text-sm font-semibold hover:border-[#137a70] hover:text-[#137a70]">
                      {department.name}<ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

export function MobileCategoryMenu({ open, onClose, navItems, roots }: { open: boolean; onClose: () => void; navItems: NavItem[]; roots: CategoryNode[] }) {
  const [openRoot, setOpenRoot] = useState<string | null>(null);
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setOpenRoot(null);
      setOpenSection(null);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] xl:hidden">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} aria-label="Close navigation" />
      <aside className="absolute inset-y-0 right-0 w-[min(90vw,390px)] overflow-y-auto bg-white p-5 shadow-xl" aria-label="Category navigation">
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
          <p className="text-lg font-semibold">Shop categories</p>
          <button type="button" onClick={onClose} className="grid h-9 w-9 place-items-center" aria-label="Close navigation"><X className="h-5 w-5" /></button>
        </div>
        <div className="py-3">
          {navItems.map((item) => {
            const root = findRootCategory(item, roots);
            if (!root && !isSpecialItem(item)) return null;
            const menuId = root?.id ?? `special:${normalize(item.label)}`;
            const expanded = openRoot === menuId;
            return (
              <div key={item.label} className="border-b border-neutral-100">
                <div className="flex items-center">
                  {root ? <button type="button" onClick={() => setOpenRoot(expanded ? null : menuId)} className="flex-1 py-4 text-left text-sm font-semibold uppercase" aria-expanded={expanded}>{item.label}</button> : <Link onClick={onClose} href={item.href} className={`flex-1 py-4 text-sm font-semibold uppercase ${item.featured ? "text-[#ee3a21]" : ""}`}>{item.label}</Link>}
                  {(root?.children.length || isSpecialItem(item)) ? <button type="button" onClick={() => setOpenRoot(expanded ? null : menuId)} className="grid h-11 w-11 place-items-center" aria-expanded={expanded} aria-label={`Toggle ${root?.name ?? item.label} categories`}><ChevronDown className={`h-4 w-4 transition ${expanded ? "rotate-180" : ""}`} /></button> : null}
                </div>
                {root && expanded ? (
                  <div className="pb-3 pl-3">
                    {root.children.map((section) => {
                      const sectionExpanded = openSection === section.id;
                      return <div key={section.id}>
                        <div className="flex items-center">
                          {section.children.length ? <button type="button" onClick={() => setOpenSection(sectionExpanded ? null : section.id)} className="flex-1 py-2.5 text-left text-sm font-medium text-[#137a70]" aria-expanded={sectionExpanded}>{section.name}</button> : <Link onClick={onClose} href={categoryHref(section.slug)} className="flex-1 py-2.5 text-sm font-medium text-[#137a70]">{section.name}</Link>}
                          {section.children.length ? <button type="button" onClick={() => setOpenSection(sectionExpanded ? null : section.id)} className="grid h-9 w-9 place-items-center" aria-expanded={sectionExpanded}><ChevronRight className={`h-4 w-4 transition ${sectionExpanded ? "rotate-90" : ""}`} /></button> : null}
                        </div>
                        {sectionExpanded ? <div className="grid gap-1 border-l border-neutral-200 pl-4">{section.children.map((child) => <Link onClick={onClose} key={child.id} href={categoryHref(child.slug)} className="py-2 text-sm text-neutral-600">{child.name}</Link>)}</div> : null}
                      </div>;
                    })}
                  </div>
                ) : null}
                {!root && expanded ? (
                  <div className="grid grid-cols-2 gap-2 pb-4 pl-3">
                    {roots.filter((department) => ["men", "women", "kids", "beauty", "footwear", "accessories"].includes(department.slug)).map((department) => (
                      <Link onClick={onClose} key={department.id} href={specialDepartmentHref(item.href, department.slug)} className="py-2 text-sm text-neutral-600">{department.name}</Link>
                    ))}
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
}

export const MobileCategoryDrawer = MobileCategoryMenu;
