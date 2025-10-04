import React from "react";
import { X, CalendarIcon, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { UseFormReturn } from "react-hook-form";
import { Calendar } from "../ui/calendar";
import { useSearchCustomer } from "@/hooks/customer/useSearchCustomer";
import { useSearchEmployee } from "@/hooks/employee/useSearchEmployee";

interface AppointmentFormData {
    isClientEvent: boolean;
    kunde: string;
    uhrzeit: string;
    selectedEventDate: Date | undefined;
    termin: string;
    mitarbeiter: string;
    bemerk: string;
    customerId?: string;
}

interface SubmittedAppointmentData {
    isClientEvent: boolean;
    kunde: string;
    uhrzeit: string;
    selectedEventDate: string | undefined;
    termin: string;
    mitarbeiter: string;
    bemerk: string;
    customerId?: string;
}

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<AppointmentFormData>;
    onSubmit: (data: SubmittedAppointmentData) => Promise<any> | void;
    title: string;
    buttonText: string;
}

export default function AppointmentModal({
    isOpen,
    onClose,
    form,
    onSubmit,
    title,
    buttonText
}: AppointmentModalProps) {
    const [submitting, setSubmitting] = React.useState(false);
    const isClientEvent = form.watch('isClientEvent');
    const kundeContainerRef = React.useRef<HTMLDivElement | null>(null);
    const employeeContainerRef = React.useRef<HTMLDivElement | null>(null);

    const clientTerminOptions = [
        { value: 'fussanalyse-laufanalyse', label: 'Fußanalyse / Laufanalyse' },
        { value: 'massnehmen', label: 'Maßnehmen' },
        { value: 'anprobe-abholung', label: 'Anprobe / Abholung' },
        { value: 'kontrolle-nachkontrolle', label: 'Kontrolle / Nachkontrolle' },
        { value: 'beratung-rezept-einloesung', label: 'Beratung / Rezept-Einlösung' },
        { value: 'hausbesuch', label: 'Hausbesuch' },
        { value: 'sonstiges', label: 'Sonstiges' },
    ];

    const otherTerminOptions = [
        { value: 'teammeeting-fallbesprechung', label: 'Teammeeting / Fallbesprechung' },
        { value: 'fortbildung-schulung', label: 'Fortbildung / Schulung' },
        { value: 'verwaltung-dokumentation', label: 'Verwaltung / Dokumentation' },
        { value: 'interne-sprechstunde-besprechung', label: 'Interne Sprechstunde / Besprechung' },
        { value: 'externe-termine-kooperation', label: 'Externe Termine / Kooperation' },
    ];

    React.useEffect(() => {
        const currentTermin = form.getValues('termin');
        const validValues = (isClientEvent ? clientTerminOptions : otherTerminOptions).map((o) => o.value);
        if (currentTermin && !validValues.includes(currentTermin)) {
            form.setValue('termin', '');
        }
    }, [isClientEvent]);

    const {
        searchName,
        setSearchName,
        handleNameChange,
        nameSuggestions,
        showNameSuggestions,
        suggestionLoading,
        handleSuggestionSelect,
        nameInputRef,
        setShowNameSuggestions,
        clearSearch,
    } = useSearchCustomer();

    const {
        searchText: employeeSearchText,
        setSearchText: setEmployeeSearchText,
        suggestions: employeeSuggestions,
        loading: employeeSuggestionLoading,
        showSuggestions: showEmployeeSuggestions,
        setShowSuggestions: setShowEmployeeSuggestions,
        handleChange: handleEmployeeChange,
        clearSearch: clearEmployeeSearch,
        inputRef: employeeInputRef,
    } = useSearchEmployee();

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            const target = event.target as Node;
            if (kundeContainerRef.current && !kundeContainerRef.current.contains(target)) {
                setShowNameSuggestions(false);
            }
            if (employeeContainerRef.current && !employeeContainerRef.current.contains(target)) {
                setShowEmployeeSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [setShowNameSuggestions, setShowEmployeeSuggestions]);

    if (!isOpen) return null;

    const handleFormSubmit = async (data: AppointmentFormData) => {
        const formattedData: SubmittedAppointmentData = {
            ...data,
            selectedEventDate: data.selectedEventDate ? data.selectedEventDate.toISOString() : undefined
        };
        try {
            setSubmitting(true);
            await Promise.resolve(onSubmit(formattedData));
        } finally {
            setSubmitting(false);
        }
    };

    const handleKundeSuggestionClick = (suggestion: any) => {
        handleSuggestionSelect(suggestion);
        if (suggestion?.name) {
            form.setValue('kunde', suggestion.name);
        }
        if (suggestion?.id) {
            form.setValue('customerId', suggestion.id);
        }
        setShowNameSuggestions(false);
    };

    return (
        <div className="fixed inset-0 bg-black/70 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-md max-h-screen overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 sm:p-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="p-4 sm:p-6 space-y-4">
                        <FormField
                            control={form.control}
                            name="isClientEvent"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between">
                                    <FormLabel>Kundentyp</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={(v) => {
                                                field.onChange(v);
                                                if (!v) {

                                                    clearSearch();
                                                    form.setValue('customerId', undefined);
                                                } else {

                                                    if (searchName) form.setValue('kunde', searchName);
                                                }
                                            }}
                                            className="data-[state=checked]:bg-[#61A07B] cursor-pointer"
                                        />
                                    </FormControl>
                                    <span className="text-sm text-gray-500">
                                        {field.value ? 'Kunde' : 'Andere'}
                                    </span>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="kunde"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kunde<span className="text-red-500">*</span></FormLabel>
                                    {form.getValues('isClientEvent') ? (
                                        <div className="relative" ref={kundeContainerRef}>
                                            <Input
                                                ref={nameInputRef}
                                                placeholder="Kunde suchen"
                                                value={searchName}
                                                onChange={(e) => {
                                                    handleNameChange(e.target.value);
                                                    setSearchName(e.target.value);
                                                    form.setValue('kunde', e.target.value);

                                                    form.setValue('customerId', undefined);
                                                }}
                                            />
                                            {suggestionLoading && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">...</div>
                                            )}
                                            {showNameSuggestions && nameSuggestions.length > 0 && (
                                                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow">
                                                    {nameSuggestions.map((s) => (
                                                        <button
                                                            type="button"
                                                            key={s.id}
                                                            className="w-full text-left px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                                            onClick={() => handleKundeSuggestionClick(s)}
                                                        >
                                                            <div className="font-medium">{s.name}</div>
                                                            <div className="text-xs text-gray-500">{s.phone || ''} {s.email ? `• ${s.email}` : ''}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <FormControl>
                                            <Input placeholder="Kunde" {...field} />
                                        </FormControl>
                                    )}
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="uhrzeit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Uhrzeit</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type="time"
                                                    className="time-input pr-10 cursor-pointer"
                                                    onClick={(e) => {
                                                        try { (e.currentTarget as any).showPicker?.(); } catch { }
                                                    }}
                                                    onFocus={(e) => {
                                                        try { (e.currentTarget as any).showPicker?.(); } catch { }
                                                    }}
                                                    onTouchStart={(e) => {
                                                        try { (e.currentTarget as any).showPicker?.(); } catch { }
                                                    }}
                                                    {...field}
                                                />
                                                <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="selectedEventDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Datum</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
                                                    <Button
                                                        variant={"outline"}
                                                        className={cn(
                                                            "w-full pl-3 cursor-pointer text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(new Date(field.value), "dd.MM.yyyy")
                                                        ) : (
                                                            <span>Datum auswählen</span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    onSelect={field.onChange}
                                                    disabled={(date) =>
                                                        date < new Date(new Date().setHours(0, 0, 0, 0))
                                                    }
                                                    initialFocus
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="termin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Grund</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="cursor-pointer">
                                                <SelectValue placeholder="Kundentermin wählen" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {(isClientEvent ? clientTerminOptions : otherTerminOptions).map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="mitarbeiter"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mitarbeiter</FormLabel>
                                    <div className="relative" ref={employeeContainerRef}>
                                        <Input
                                            ref={employeeInputRef}
                                            placeholder="Mitarbeiter suchen"
                                            value={employeeSearchText || field.value || ''}
                                            onChange={(e) => {
                                                handleEmployeeChange(e.target.value);
                                                setEmployeeSearchText(e.target.value);
                                                field.onChange(e.target.value);
                                            }}
                                            onFocus={() => {
                                                setShowEmployeeSuggestions(true);
                                                if (!(employeeSearchText || field.value)) {
                                                    handleEmployeeChange('');
                                                }
                                            }}
                                        />
                                        {employeeSuggestionLoading && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">...</div>
                                        )}
                                        {showEmployeeSuggestions && employeeSuggestions.length > 0 && (
                                            <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow">
                                                {employeeSuggestions.map((s) => (
                                                    <button
                                                        type="button"
                                                        key={s.id}
                                                        className="w-full text-left px-3 py-2 hover:bg-gray-50 cursor-pointer"
                                                        onClick={() => {
                                                            field.onChange(s.employeeName);
                                                            setEmployeeSearchText(s.employeeName);
                                                            setShowEmployeeSuggestions(false);
                                                        }}
                                                    >
                                                        <div className="font-medium">{s.employeeName}</div>
                                                        <div className="text-xs text-gray-500">{s.email || ''}</div>
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="bemerk"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Betreff</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Betreff"
                                            className="resize-none h-24"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-center">
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="bg-[#61A07B] cursor-pointer hover:bg-[#528c68] text-white rounded-3xl disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {submitting ? 'Bitte warten...' : buttonText}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
} 