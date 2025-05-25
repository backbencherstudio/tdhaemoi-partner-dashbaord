import React from 'react'

export default function CustomerCommunication() {
    return (
        <div className="space-y-4 bg-white p-3 rounded-lg ">
            <h2 className="text-xl font-semibold mb-4">Customer Communication</h2>
            <p className="text-gray-600 text-sm mb-6">
                This section includes settings for how you interact with customers.
                It may include:
            </p>

            <div className="space-y-4">
                <div className="flex flex-col gap-2">
                    <label className="font-medium">Automated Emails</label>
                    <input
                        type="text"
                        placeholder="Order confirmation, reminder emails"
                        className="border border-gray-600 rounded-md p-2 w-full"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-medium">Chat Integration</label>
                    <input
                        type="text"
                        className="border border-gray-600 rounded-md p-2 w-full"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className="font-medium">Message Templates</label>
                    <input
                        type="text"
                        placeholder="Customer outreach"
                        className="border border-gray-600 rounded-md p-2 w-full"
                    />
                </div>
            </div>
        </div>
    )
}
