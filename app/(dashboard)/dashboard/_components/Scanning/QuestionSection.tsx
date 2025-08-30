"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { addCustomerQuestion, getCustomerQuestionOptions } from "@/apis/customerApis";
import toast from "react-hot-toast";

// Types for the category data
interface CategoryQuestion {
    question: string;
    options: string[] | SubQuestion[];
}

interface SubQuestion {
    id: number;
    question: string;
    options: string[];
}

interface CategoryData {
    id: number;
    category: string[];
    questions: CategoryQuestion[];
}

type Category = "ALLTAGSEINLAGE" | "SPORTEINLAGE" | "BUSINESSEINLAGE";

export default function QuestionSection({ customer }: { customer: any }) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [filteredQuestions, setFilteredQuestions] = useState<CategoryData[]>([]);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [showCommonQuestions, setShowCommonQuestions] = useState(false);
    const [categorySpecificQuestion, setCategorySpecificQuestion] = useState<CategoryData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [hasExistingAnswers, setHasExistingAnswers] = useState(false);

    const loadCustomerAnswers = useCallback(async () => {
        try {
            const response = await getCustomerQuestionOptions(customer.id);
            if (response.success && response.data) {
                const customerData = response.data;
                const categories = Object.keys(customerData.answer);
                if (categories.length > 0) {
                    const loadedCategory = categories[0] as Category;
                    setSelectedCategory(loadedCategory);
                    setHasExistingAnswers(true);
                    const formattedAnswers = formatLoadedAnswers(customerData.answer[loadedCategory]);
                    setAnswers(formattedAnswers);
                    setShowCommonQuestions(true);
                }
            }
        } catch (error) {
            // no-op
        }
    }, [customer?.id]);

    const loadCategoryData = useCallback(async () => {
        try {
            const response = await fetch('/data/questionData.json');
            const data = await response.json();
            setCategoryData(data);

            if (customer?.id) {
                await loadCustomerAnswers();
            }
        } catch (error) {
            // no-op
        }
    }, [customer?.id, loadCustomerAnswers]);

    // Load category data on component mount
    useEffect(() => {
        loadCategoryData();
    }, [loadCategoryData]);

    const formatLoadedAnswers = (loadedAnswers: any[]) => {
        const formattedAnswers: Record<string, any> = {};

        loadedAnswers.forEach((item: any) => {
            const questionId = item.questionId;
            // console.log('Processing item:', item);

            if (Array.isArray(item.answer)) {
                // Handle nested questions (ID 6 - pain details)
                // console.log('Found nested answers for question', questionId, ':', item.answer);
                item.answer.forEach((subAnswer: any) => {
                    const key = `${questionId}-0_${subAnswer.questionId}`;
                    formattedAnswers[key] = subAnswer.selected;
                    // console.log('Setting nested answer:', key, '=', subAnswer.selected);
                });

                // Also store the raw nested data for readonly display
                formattedAnswers[`${questionId}-0_nested`] = item.answer;
            } else {
                // Handle regular questions
                const key = `${questionId}-0`;
                formattedAnswers[key] = item.answer;
                // console.log('Setting regular answer:', key, '=', item.answer);
            }
        });

        // console.log('Final formatted answers for state:', formattedAnswers);
        return formattedAnswers;
    };



    useEffect(() => {
        if (selectedCategory && categoryData.length > 0) {
            const specificQuestion = categoryData.find(item => {
                if (selectedCategory === "ALLTAGSEINLAGE" && item.id === 1) return true;
                if (selectedCategory === "SPORTEINLAGE" && item.id === 2) return true;
                return false;
            });

            setCategorySpecificQuestion(specificQuestion || null);

            if (showCommonQuestions || selectedCategory === "BUSINESSEINLAGE") {
                const commonQuestions = categoryData.filter(item =>
                    item.category.includes(selectedCategory) && item.id >= 3
                ).sort((a, b) => a.id - b.id);

                setFilteredQuestions(commonQuestions);
            } else {
                setFilteredQuestions([]);
            }
        }
    }, [selectedCategory, categoryData, showCommonQuestions]);

    const handleCategorySelect = (category: Category) => {
        setSelectedCategory(category);
        setAnswers({});
        setShowCommonQuestions(false);
    };

    const handleAnswerChange = (questionId: string, answer: string, isCheckbox = false) => {
        setAnswers(prev => {
            const newAnswers = { ...prev };

            if (isCheckbox) {
                const currentAnswers = newAnswers[questionId] || [];
                if (currentAnswers.includes(answer)) {
                    newAnswers[questionId] = currentAnswers.filter((a: string) => a !== answer);
                } else {
                    newAnswers[questionId] = [...currentAnswers, answer];
                }
            } else {
                newAnswers[questionId] = answer;
            }

            if (categorySpecificQuestion && questionId.startsWith(`${categorySpecificQuestion.id}-`)) {
                setShowCommonQuestions(true);
            }

            return newAnswers;
        });
    };

    const formatAnswersForAPI = () => {
        const formattedAnswers: any[] = [];
        Object.keys(answers).forEach(key => {
            if (key.includes('_input')) return;
            const answer = answers[key];
            if (!answer) return;
            const questionId = key.split('-')[0];
            if (key.includes('_')) {
                const [mainKey, subId] = key.split('_');
                const mainQuestionId = mainKey.split('-')[0];
                let existingAnswer = formattedAnswers.find(a => a.questionId === parseInt(mainQuestionId));
                if (!existingAnswer) {
                    existingAnswer = {
                        questionId: parseInt(mainQuestionId),
                        selected: []
                    };
                    formattedAnswers.push(existingAnswer);
                }
                existingAnswer.selected.push({
                    selected: answer,
                    questionId: parseInt(subId)
                });
            } else {
                let finalAnswer = answer;
                const inputKey = `${key}_input`;
                if (answers[inputKey]) {
                    finalAnswer = answers[inputKey];
                }
                formattedAnswers.push({
                    questionId: parseInt(questionId),
                    selected: finalAnswer
                });
            }
        });
        return formattedAnswers;
    };

    const handleSaveAnswers = async () => {
        if (!selectedCategory) return;
        setIsLoading(true);
        try {
            const answers = formatAnswersForAPI();
            const requestData = {
                customerId: customer.id,
                category: selectedCategory,
                answers: answers
            };
            await addCustomerQuestion(requestData);

            // After successful save, reload customer answers and switch to readonly
            await loadCustomerAnswers();
            toast.success('Antworten erfolgreich gespeichert!');

        } catch (error) {
            toast.error('Fehler beim Speichern der Antworten');
        } finally {
            setIsLoading(false);
        }
    };

    const renderOptions = (options: string[] | SubQuestion[], questionId: string, isCheckbox = false) => {
        if (options.length > 0 && typeof options[0] === 'object' && 'id' in options[0]) {
            return (
                <div className="flex flex-col gap-4">
                    <Accordion type="multiple" className="w-full space-y-1">
                        {(options as SubQuestion[]).map((subQ, subIndex) => (
                            <AccordionItem key={`sub-${questionId}-${subQ.id}-${subIndex}`} value={`sub-${questionId}-${subQ.id}-${subIndex}`}>
                                <AccordionTrigger className="text-left text-sm bg-gray-50 px-3 py-1 rounded-lg hover:bg-blue-100">
                                    <span className="font-medium ">
                                        {subQ.id}. {subQ.question}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="pt-3">
                                    <div className="pl-4 border-l-2 border-blue-200">
                                        <div className="flex flex-col gap-2">
                                            {subQ.options.map((option, optIndex) => (
                                                <label key={`${subQ.id}-${optIndex}-${option}`} className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name={`${questionId}_${subQ.id}`}
                                                        value={option}
                                                        checked={answers[`${questionId}_${subQ.id}`] === option}
                                                        onChange={(e) => handleAnswerChange(`${questionId}_${subQ.id}`, e.target.value)}
                                                        className="w-4 h-4 text-blue-600"
                                                    />
                                                    <span className="text-gray-700">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-2">
                {(options as string[]).map((option, optIndex) => {
                    const isSelected = isCheckbox
                        ? (answers[questionId] || []).includes(option)
                        : answers[questionId] === option;

                    return (
                        <label key={`${questionId}-${optIndex}-${option}`} className="flex items-center gap-2">
                            <input
                                type={isCheckbox ? "checkbox" : "radio"}
                                name={questionId}
                                value={option}
                                checked={isSelected}
                                onChange={(e) => handleAnswerChange(questionId, e.target.value, isCheckbox)}
                                className="w-4 h-4"
                            />
                            <span>{option}</span>
                            {(option.includes("bitte eingeben") || option.includes("bitte angeben")) && (
                                <Input
                                    className="ml-2 max-w-xs"
                                    placeholder="Bitte angeben"
                                    value={answers[`${questionId}_input`] || ''}
                                    onChange={(e) => handleAnswerChange(`${questionId}_input`, e.target.value)}
                                />
                            )}
                        </label>
                    );
                })}
            </div>
        );
    };

    const renderReadonlyOptions = (options: string[] | SubQuestion[], questionId: string, selectedAnswer: any) => {
        // console.log('Rendering readonly options:', { questionId, selectedAnswer, currentAnswers: answers });

        // Handle nested questions (ID 6 - pain details)
        if (options.length > 0 && typeof options[0] === 'object' && 'id' in options[0]) {
            //  console.log('Processing nested question with selectedAnswer:', selectedAnswer);
            return (
                <div className="flex flex-col gap-4">
                    <Accordion type="multiple" className="w-full space-y-1">
                        {(options as SubQuestion[]).map((subQ, subIndex) => (
                            <AccordionItem key={`readonly-sub-${questionId}-${subQ.id}-${subIndex}`} value={`readonly-sub-${questionId}-${subQ.id}-${subIndex}`}>
                                <AccordionTrigger className="text-left text-sm bg-gray-50 px-3 py-1 rounded-lg hover:bg-blue-100">
                                    <span className="font-medium">
                                        {subQ.id}. {subQ.question}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="pt-3">
                                    <div className="pl-4 border-l-2 border-blue-200">
                                        <div className="flex flex-col gap-2">
                                            {subQ.options.map((option, optIndex) => {
                                                // Check if this option is selected from current state or nested data
                                                const subQuestionKey = `${questionId}_${subQ.id}`;
                                                let isSelected = answers[subQuestionKey] === option;

                                                // Also check in nested selectedAnswer array (for backend data)
                                                if (!isSelected && Array.isArray(selectedAnswer)) {
                                                    isSelected = selectedAnswer.some((ans: any) =>
                                                        ans.questionId === subQ.id && ans.selected === option
                                                    );
                                                }

                                                // console.log(`Sub-question ${subQ.id} option "${option}":`, { isSelected, subQuestionKey, selectedAnswer });

                                                return (
                                                    <label key={optIndex} className="flex items-center gap-2 text-sm">
                                                        <input
                                                            type="radio"
                                                            checked={isSelected}
                                                            disabled
                                                            className="w-4 h-4"
                                                        />
                                                        <span className={`${isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
                                                            {option}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            );
        }

        // Handle regular options
        return (
            <div className="flex flex-col gap-2">
                {(options as string[]).map((option, optIndex) => {
                    // Check from current state, not just selectedAnswer parameter
                    const currentAnswer = answers[questionId];
                    const inputAnswer = answers[`${questionId}_input`];

                    // Check if this is a custom text that doesn't match any option
                    const isCustomText = selectedAnswer &&
                        typeof selectedAnswer === 'string' &&
                        !(options as string[]).includes(selectedAnswer) &&
                        (option.includes('bitte eingeben') || option.includes('bitte angeben'));

                    const isSelected = isCustomText || currentAnswer === option;
                    const displayText = isCustomText ? selectedAnswer : (inputAnswer || currentAnswer);

                    return (
                        <label key={optIndex} className="flex items-center gap-2">
                            <input
                                type="radio"
                                checked={isSelected}
                                disabled
                                className="w-4 h-4"
                            />
                            <span className={`${isSelected ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
                                {option}
                            </span>
                            {/* Show input field value if it exists */}
                            {(option.includes("bitte eingeben") || option.includes("bitte angeben")) && isSelected && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium ml-2">
                                    "{isCustomText ? selectedAnswer : answers[`${questionId}_input`]}"
                                </span>
                            )}
                        </label>
                    );
                })}
            </div>
        );
    };

    const renderReadonlyAnswers = () => {
        if (!hasExistingAnswers) return null;


        // const allQuestions = [...(categorySpecificQuestion ? categorySpecificQuestion.questions : []), ...filteredQuestions.flatMap(item => item.questions)];

        return (
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">
                        Ihre Antworten für: <span className="text-blue-600">{selectedCategory?.replace('EINLAGE', ' EINLAGE')}</span>
                    </h2>
                    <Button
                        variant="outline"
                        className="cursor-pointer"
                        size="sm"
                        onClick={() => {
                            setHasExistingAnswers(false);
                            setSelectedCategory(null);
                            setAnswers({});
                            setShowCommonQuestions(false);
                        }}
                    >
                        Bearbeiten
                    </Button>
                </div>

                <div className="space-y-2">
                    {/* Category-specific question with Accordion */}
                    {categorySpecificQuestion && (
                        <Accordion type="single" collapsible className="w-full">
                            {categorySpecificQuestion.questions.map((question, qIndex) => {
                                const questionKey = `${categorySpecificQuestion.id}-${qIndex}`;
                                const answer = answers[questionKey];

                                if (!answer) return null;

                                return (
                                    <AccordionItem key={questionKey} value={`readonly-specific-${questionKey}`}>
                                        <AccordionTrigger className="text-left hover:no-underline">
                                            <div className="flex items-start gap-3">
                                                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full min-w-[24px] h-6 flex items-center justify-center">
                                                    1
                                                </span>
                                                <span className="flex-1">{question.question}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="ml-9">
                                                {renderReadonlyOptions(question.options, questionKey, answer)}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    )}

                    {/* Common questions with Accordion */}
                    {filteredQuestions.length > 0 && (
                        <Accordion type="single" collapsible className="w-full">
                            {filteredQuestions.map((item, index) =>
                                item.questions.map((question, qIndex) => {
                                    const questionKey = `${item.id}-${qIndex}`;
                                    const answer = answers[questionKey];
                                    const inputAnswer = answers[`${questionKey}_input`];
                                    const nestedAnswer = answers[`${questionKey}_nested`]; // For ID 6 nested data
                                    const finalAnswer = inputAnswer || answer;

                                    // In readonly view, show all questions with answers
                                    // Skip questions that have no answer at all
                                    if (!finalAnswer && !nestedAnswer && !answer) return null;

                                    const questionNumber = selectedCategory === "BUSINESSEINLAGE" ? index + 1 : index + 2;

                                    return (
                                        <AccordionItem key={questionKey} value={`readonly-common-${questionKey}`}>
                                            <AccordionTrigger className="text-left hover:no-underline">
                                                <div className="flex items-start gap-3">
                                                    <span className="bg-gray-100 text-gray-800 text-sm font-semibold px-2 py-1 rounded-full min-w-[24px] h-6 flex items-center justify-center">
                                                        {questionNumber}
                                                    </span>
                                                    <span className="flex-1">{question.question}</span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <div className="ml-9">
                                                    {renderReadonlyOptions(question.options, questionKey, nestedAnswer || finalAnswer)}
                                                </div>
                                            </AccordionContent>
                                        </AccordionItem>
                                    );
                                })
                            )}
                        </Accordion>
                    )}
                </div>

                {/* Update Button - Hidden in readonly view */}
            </div>
        );
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Kundenspezifische Antworten – Einlagenfinder</h1>

            {!selectedCategory && !hasExistingAnswers && (
                <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Wählen Sie eine Kategorie:</h2>
                    <div className="grid grid-cols-1 gap-3">
                        <Button
                            variant="outline"
                            className="h-auto cursor-pointer p-4 text-left justify-start hover:bg-gray-50 hover:border-gray-300"
                            onClick={() => handleCategorySelect("ALLTAGSEINLAGE")}
                        >
                            <div className="font-semibold">Alltagseinlage</div>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto cursor-pointer p-4 text-left justify-start hover:bg-gray-50 hover:border-gray-300"
                            onClick={() => handleCategorySelect("SPORTEINLAGE")}
                        >
                            <div className="font-semibold">Sporteinlage</div>
                        </Button>
                        <Button
                            variant="outline"
                            className="h-auto cursor-pointer p-4 text-left justify-start hover:bg-gray-50 hover:border-gray-300"
                            onClick={() => handleCategorySelect("BUSINESSEINLAGE")}
                        >
                            <div className="font-semibold">Businesseinlage</div>
                        </Button>
                    </div>
                </div>
            )}

            {/* Readonly Answers View */}
            {hasExistingAnswers && renderReadonlyAnswers()}

            {/* Questions Section */}
            {selectedCategory && !hasExistingAnswers && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">
                            Fragen für: <span className="">{selectedCategory.replace('EINLAGE', ' EINLAGE')}</span>
                        </h2>
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            size="sm"
                            onClick={() => {
                                setSelectedCategory(null);
                                setShowCommonQuestions(false);
                            }}
                        >
                            Kategorie ändern
                        </Button>
                    </div>

                    {/* Category-Specific Question */}
                    {categorySpecificQuestion && !showCommonQuestions && (
                        <div className="mb-6">

                            <Accordion type="single" collapsible className="w-full">
                                {categorySpecificQuestion.questions.map((question, qIndex) => (
                                    <AccordionItem key={`specific-${categorySpecificQuestion.id}-${qIndex}`} value={`specific-${categorySpecificQuestion.id}-${qIndex}`}>
                                        <AccordionTrigger className="text-left">
                                            <div className="flex items-start gap-3">
                                                <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-2 py-1 rounded-full min-w-[24px] h-6 flex items-center justify-center">
                                                    1
                                                </span>
                                                <span className="flex-1">{question.question}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <div className="ml-9">
                                                {renderOptions(
                                                    question.options,
                                                    `${categorySpecificQuestion.id}-${qIndex}`,
                                                    false
                                                )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </div>
                    )}


                    {(showCommonQuestions || selectedCategory === "BUSINESSEINLAGE") && filteredQuestions.length > 0 && (
                        <div className="mb-6">
                            <Accordion type="single" collapsible className="w-full">
                                {filteredQuestions.map((item, index) =>
                                    item.questions.map((question, qIndex) => {
                                        const questionNumber = selectedCategory === "BUSINESSEINLAGE" ? index + 1 : index + 2;

                                        return (
                                            <AccordionItem key={`${item.id}-${qIndex}`} value={`item-${item.id}-${qIndex}`}>
                                                <AccordionTrigger className="text-left">
                                                    <div className="flex items-start gap-3">
                                                        <span className="bg-gray-100 text-gray-800 text-sm font-semibold px-2 py-1 rounded-full min-w-[24px] h-6 flex items-center justify-center">
                                                            {questionNumber}
                                                        </span>
                                                        <span className="flex-1">{question.question}</span>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <div className="ml-9">
                                                        {renderOptions(
                                                            question.options,
                                                            `${item.id}-${qIndex}`,
                                                            question.question.toLowerCase().includes('erwartungen')
                                                        )}
                                                    </div>
                                                </AccordionContent>
                                            </AccordionItem>
                                        );
                                    })
                                )}
                            </Accordion>
                        </div>
                    )}


                    {(showCommonQuestions || selectedCategory === "BUSINESSEINLAGE") && (
                        <div className="mt-6">
                            <Button
                                className="w-full"
                                onClick={handleSaveAnswers}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Speichern...' : 'Antworten speichern'}
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}