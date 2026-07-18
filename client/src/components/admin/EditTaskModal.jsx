import { useState } from 'react';
import { toast } from 'react-toastify';
import { updateTask, fetchTalents } from '../../api/tasks';

const STATUS_OPTIONS = ['Open', 'Claimed', 'Submitted', 'Approved', 'Rejected'];
const inputCls = 'w-full bg-bg-input border border-border rounded-lg px-3.5 py-2.5 text-sm text-text-primary outline-none placeholder:text-[#4e4a6e] focus:border-primary focus:ring-[3px] focus:ring-primary/15 transition-all font-sans resize-y';
const labelCls = 'text-[11px] font-semibold uppercase tracking-[0.5px] text-text-muted';

const EditTaskModal = ({ task, onClose, onUpdated }) => {
  const [form, setForm] = useState({
    title:       task.title       || '',
    description: task.description || '',
    status:      task.status      || 'Open',
    assignedTo:  task.assignedTo?._id || '',
    dueDate:     task.dueDate     || '',
  });
  const [talents, setTalents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useState(() => {
    fetchTalents().then(({ data }) => setTalents(data)).catch(() => {});
  }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await updateTask(task._id, { ...form, assignedTo: form.assignedTo || null });
      toast.success('Task updated successfully');
      onUpdated(data);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update task');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/65 backdrop-blur-sm flex items-center justify-center z-[200] p-6"
      onClick={onClose}>
      <div className="bg-bg-card border border-border rounded-xl w-full max-w-xl shadow-[0_32px_80px_rgba(0,0,0,0.6)] animate-modal-in"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-[17px] font-semibold text-text-primary">Edit Task</h2>
          <button onClick={onClose}
            className="bg-transparent border-none text-text-muted text-base cursor-pointer px-2 py-1 rounded-md hover:bg-bg-hover hover:text-text-primary transition-all">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-[18px]">
          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Title</label>
            <input name="title" value={form.title} onChange={handleChange} className={inputCls} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className={inputCls} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Status</label>
              <select name="status" value={form.status} onChange={handleChange}
                className={`${inputCls} custom-select cursor-pointer`}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelCls}>Due Date</label>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} className={inputCls} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelCls}>Assign To</label>
            <select name="assignedTo" value={form.assignedTo} onChange={handleChange}
              className={`${inputCls} custom-select cursor-pointer`}>
              <option value="">— Unassigned —</option>
              {talents.map((t) => <option key={t._id} value={t._id}>{t.name} ({t.email})</option>)}
            </select>
          </div>

          <div className="flex justify-end gap-2.5 pt-1 border-t border-border mt-1">
            <button type="button" onClick={onClose}
              className="px-5 py-2.5 bg-bg-input text-text-muted border border-border rounded-lg text-sm font-medium cursor-pointer hover:bg-bg-hover hover:text-text-primary transition-all font-sans">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white cursor-pointer btn-gradient border-none font-sans disabled:opacity-70 disabled:cursor-not-allowed">
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
