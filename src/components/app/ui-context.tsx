"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { AssignmentForm } from "./assignment-form";
import { ImportModal } from "./import-modal";
import { UpgradeModal } from "./upgrade-modal";
import { useStore } from "@/lib/store";
import { activeAssignments, courseList } from "@/lib/selectors";
import { FREE_ACTIVE_LIMIT } from "@/lib/pricing";
import { toast } from "sonner";

interface UIContextValue {
  openAdd: () => void;
  openImport: () => void;
  openUpgrade: () => void;
  openEdit: (id: string) => void;
}

const UIContext = createContext<UIContextValue | null>(null);

export function useAppUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useAppUI must be used within AppUIProvider");
  return ctx;
}

export function AppUIProvider({ children }: { children: React.ReactNode }) {
  const assignments = useStore((s) => s.assignments);
  const profile = useStore((s) => s.profile);
  const addAssignment = useStore((s) => s.addAssignment);
  const updateAssignment = useStore((s) => s.updateAssignment);
  const setSubtasks = useStore((s) => s.setSubtasks);

  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const courses = useMemo(
    () => courseList(assignments).map((c) => c.name),
    [assignments]
  );
  const editing = assignments.find((a) => a.id === editId) ?? null;

  const atLimit =
    profile.plan === "free" &&
    activeAssignments(assignments).length >= FREE_ACTIVE_LIMIT;

  const value = useMemo<UIContextValue>(
    () => ({
      openAdd: () => {
        if (atLimit) {
          toast("You've hit the Free plan limit", {
            description: `Upgrade to add more than ${FREE_ACTIVE_LIMIT} active assignments.`,
          });
          setUpgradeOpen(true);
          return;
        }
        setAddOpen(true);
      },
      openImport: () => {
        if (atLimit) {
          setUpgradeOpen(true);
          return;
        }
        setImportOpen(true);
      },
      openUpgrade: () => setUpgradeOpen(true),
      openEdit: (id: string) => setEditId(id),
    }),
    [atLimit]
  );

  return (
    <UIContext.Provider value={value}>
      {children}

      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="New assignment"
        description="AcademiaAI will slot it into your plan automatically."
        size="lg"
      >
        <AssignmentForm
          courses={courses}
          onSubmit={(a) => {
            addAssignment(a);
            toast.success("Added", { description: "It's now in your plan." });
            setAddOpen(false);
          }}
          onCancel={() => setAddOpen(false)}
        />
      </Modal>

      <Modal
        open={!!editing}
        onClose={() => setEditId(null)}
        title="Edit assignment"
        size="lg"
      >
        {editing && (
          <AssignmentForm
            key={editing.id}
            courses={courses}
            submitLabel="Save changes"
            initial={{
              title: editing.title,
              course: editing.course,
              dueDate: editing.dueDate ?? "",
              difficulty: editing.difficulty,
              estimatedMinutes: editing.estimatedMinutes,
              importance: editing.importance,
              notes: editing.notes,
              subtasks: editing.subtasks.map((s) => s.title),
            }}
            onSubmit={(a) => {
              updateAssignment(editing.id, {
                title: a.title,
                course: a.course,
                dueDate: a.dueDate,
                difficulty: a.difficulty,
                estimatedMinutes: a.estimatedMinutes,
                importance: a.importance,
                notes: a.notes,
              });
              // Only replace subtasks if the set changed (preserve done state otherwise).
              const currentTitles = editing.subtasks.map((s) => s.title).join("|");
              const nextTitles = (a.subtasks ?? []).join("|");
              if (currentTitles !== nextTitles) {
                setSubtasks(editing.id, a.subtasks ?? []);
              }
              toast.success("Saved");
              setEditId(null);
            }}
            onCancel={() => setEditId(null)}
          />
        )}
      </Modal>

      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} />
      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </UIContext.Provider>
  );
}
