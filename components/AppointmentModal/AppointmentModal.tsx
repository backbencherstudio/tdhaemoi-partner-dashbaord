import { X, CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { UseFormReturn } from "react-hook-form";

interface AppointmentFormData {
    isClientEvent: boolean;
    kunde: string;
    uhrzeit: string;
    selectedEventDate: Date | undefined;
    termin: string;
    mitarbeiter: string;
    bemerk: string;
}

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    form: UseFormReturn<AppointmentFormData>;
    onSubmit: (data: AppointmentFormData) => void;
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
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="p-4 sm:p-6 space-y-4">
                        <FormField
                            control={form.control}
                            name="isClientEvent"
                            render={({ field }) => (
                                <FormItem className="flex items-center justify-between">
                                    <FormLabel>Kundentyp</FormLabel>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
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
                                    <FormControl>
                                        <Input placeholder="Kunde" {...field} />
                                    </FormControl>
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
                                            <Input type="time" {...field} />
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
                                                            "w-full pl-3 text-left font-normal",
                                                            !field.value && "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value ? (
                                                            format(new Date(field.value), "PPP", { locale: de })
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
                                                    locale={de}
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
                                            <SelectTrigger>
                                                <SelectValue placeholder="Kundentermin wählen" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="meeting">Meeting</SelectItem>
                                            <SelectItem value="analyse">Analyse</SelectItem>
                                            <SelectItem value="consultation">Consultation</SelectItem>
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
                                    <FormControl>
                                        <Input placeholder="Mitarbeiter" {...field} />
                                    </FormControl>
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
                                className="bg-[#61A07B] hover:bg-[#528c68] text-white rounded-3xl"
                            >
                                {buttonText}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
} 