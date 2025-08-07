"use client";
import React, { useState, useEffect } from "react";
import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

export default function QuestionSection() {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [filteredQuestions, setFilteredQuestions] = useState<CategoryData[]>([]);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [showCommonQuestions, setShowCommonQuestions] = useState(false);
    const [categorySpecificQuestion, setCategorySpecificQuestion] = useState<CategoryData | null>(null);

    // Load category data on component mount
    useEffect(() => {
        const loadCategoryData = async () => {
            try {
                const response = await fetch('/data/categoryData.json');
                const data = await response.json();
                setCategoryData(data);
            } catch (error) {
                console.error('Error loading category data:', error);
            }
        };

        loadCategoryData();
    }, []);

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
                {(options as string[]).map((option, optIndex) => (
                    <label key={`${questionId}-${optIndex}-${option}`} className="flex items-center gap-2">
                        <input
                            type={isCheckbox ? "checkbox" : "radio"}
                            name={questionId}
                            value={option}
                            onChange={(e) => handleAnswerChange(questionId, e.target.value, isCheckbox)}
                            className="w-4 h-4"
                        />
                        <span>{option}</span>
                        {(option.includes("bitte eingeben") || option.includes("bitte angeben")) && (
                            <Input
                                className="ml-2 max-w-xs"
                                placeholder="Bitte angeben"
                                onChange={(e) => handleAnswerChange(`${questionId}_input`, e.target.value)}
                            />
                        )}
                    </label>
                ))}
            </div>
        );
    };

    return (
        <>
            <h1 className="text-2xl font-bold mb-4">Kundenspezifische Antworten – Einlagenfinder</h1>

            {!selectedCategory && (
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

            {/* Questions Section */}
            {selectedCategory && (
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
                                onClick={() => {

                                }}
                            >
                                Antworten speichern
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}